import { db, projects, whiteboardData } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { purgeExpiredProjects } from "@/lib/archive-cleanup";

async function getOwnedProject(projectId: string) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) return null;

  const result = await db
    .select({ projectId: projects.projectId, archivedAt: projects.archivedAt })
    .from(projects)
    .where(and(eq(projects.projectId, projectId), eq(projects.userEmail, email)))
    .limit(1);

  return result[0] ?? null;
}

export async function GET(req: NextRequest) {
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

  if (projectId) {
    try {
      const project = await getOwnedProject(projectId);

      if (!project) {
        return NextResponse.json(
          { error: "Unauthorized access." },
          { status: 401 },
        );
      }

      if (project.archivedAt) {
        return NextResponse.json(
          { error: "Workspace is archived." },
          { status: 403 },
        );
      }

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
