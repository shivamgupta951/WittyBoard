import { db, projects, whiteboardData } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { purgeExpiredProjects } from "@/lib/archive-cleanup";

const MAX_WHITEBOARD_PAYLOAD_BYTES = 8 * 1024 * 1024;

function isAcceptableCanvasPayload(
  elements: unknown,
  appState: unknown,
  files: unknown,
) {
  if (!Array.isArray(elements) || !appState || typeof appState !== "object") {
    return false;
  }

  if (!files || typeof files !== "object") return false;

  // JSON.stringify provides a practical upper bound for JSONB and base64 image data.
  return Buffer.byteLength(JSON.stringify({ elements, appState, files })) <= MAX_WHITEBOARD_PAYLOAD_BYTES;
}

async function getOwnedProject(projectId: string) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) return null;

  // Ownership is checked server-side for every canvas operation; a project ID
  // in the URL is never treated as proof that the caller owns the project.
  const result = await db
    .select({ projectId: projects.projectId, archivedAt: projects.archivedAt })
    .from(projects)
    .where(and(eq(projects.projectId, projectId), eq(projects.userEmail, email)))
    .limit(1);

  return result[0] ?? null;
}

export async function GET(req: NextRequest) {
  // Remove expired archives before returning canvas data.
  await purgeExpiredProjects();
  const projectId = req.nextUrl.searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "Project information missing." },
      { status: 400 },
    );
  }

  const project = await getOwnedProject(projectId);

  if (!project) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  if (project.archivedAt) {
    return NextResponse.json({ error: "Workspace is archived." }, { status: 403 });
  }

  const result = await db
    .select()
    .from(whiteboardData)
    .where(eq(whiteboardData.projectId, projectId))
    .limit(1);

  return NextResponse.json(result[0] ?? null);
}

export async function POST(req: NextRequest) {
  await purgeExpiredProjects();
  const { projectId, elements, files, appState } = await req.json();

  if (!isAcceptableCanvasPayload(elements, appState, files)) {
    return NextResponse.json(
      { error: "Whiteboard payload is invalid or exceeds the 8 MB limit." },
      { status: 413 },
    );
  }

  if (projectId) {
    try {
      const project = await getOwnedProject(projectId);

      if (!project) {
        return NextResponse.json(
          { error: "Unauthorized access." },
          { status: 401 },
        );
      }

      // Archived workspaces are intentionally read-only. The dashboard hides
      // their editor, but this API guard also protects direct requests.
      if (project.archivedAt) {
        return NextResponse.json(
          { error: "Workspace is archived." },
          { status: 403 },
        );
      }

      // Ownership and archive checks happen before the upsert, so a guessed
      // projectId cannot be used to overwrite another user's canvas.
      const result = await db
        .insert(whiteboardData)
        .values({
          projectId,
          elements,
          appState,
          files,
        })
        .onConflictDoUpdate({
          target: whiteboardData.projectId,
          set: {
            elements,
            appState,
            files,
            updatedAt: new Date(),
          },
        });

      return NextResponse.json(result);
    } catch {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { error: "Project information missing." },
    { status: 400 },
  );
}
