import { db, projects, users } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, asc, eq, isNull, isNotNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { count } from "drizzle-orm";
import { MAX_WORKSPACES } from "@/lib/constants";
import {
  getArchiveExpiryDate,
  purgeExpiredProjects,
} from "../../../lib/archive-cleanup";

export async function POST(req: NextRequest) {
  await purgeExpiredProjects();
  const { projectName, projectId } = await req.json();
  const user = await currentUser();

  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "Unautharized User!" });
  }
  if (!projectId || !projectName) {
    return NextResponse.json({ error: "Project details missing!" });
  }

  const existingProjects = await db
    .select({ count: count() })
    .from(projects)
    .where(eq(projects.userEmail, user.primaryEmailAddress.emailAddress));
  const workspaceCount = Number(existingProjects[0]?.count ?? 0);

  if (workspaceCount >= MAX_WORKSPACES) {
    return NextResponse.json(
      { error: `Workspace limit reached. You can create up to ${MAX_WORKSPACES} workspaces.` },
      { status: 403 },
    );
  }

  const result = await db
    .insert(projects)
    .values({
      projectId: projectId,
      projectName: projectName ?? "",
      userEmail: user?.primaryEmailAddress?.emailAddress ?? "",
    })
    .returning();

  await db
    .update(users)
    .set({ credits: Math.max(0, MAX_WORKSPACES - workspaceCount - 1) })
    .where(eq(users.email, user.primaryEmailAddress.emailAddress));

  return NextResponse.json(result[0]);
}


export async function GET(req: NextRequest) {
  await purgeExpiredProjects();
  const projectId = req.nextUrl.searchParams.get("projectId");
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized User!" }, { status: 401 });
  }

  if (!projectId) {
    const archived = req.nextUrl.searchParams.get("archived") === "true";
    const result = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.userEmail, email),
          archived ? isNotNull(projects.archivedAt) : isNull(projects.archivedAt),
        ),
      )
      .orderBy(asc(projects.createdAt));

    return NextResponse.json(result);
  }

  const result = await db
    .select({
      projectId: projects.projectId,
      projectName: projects.projectName,
      archivedAt: projects.archivedAt,
    })
    .from(projects)
    .where(and(eq(projects.projectId, projectId), eq(projects.userEmail, email)))
    .limit(1);

  if (!result[0]) {
    return NextResponse.json({ error: "Project not found!" }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}

export async function DELETE(req: NextRequest) {
  await purgeExpiredProjects();
  const { projectId } = await req.json();
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized User!" }, { status: 401 });
  }

  if (!projectId) {
    return NextResponse.json(
      { error: "Project details missing!" },
      { status: 400 },
    );
  }

  const ownedProject = await db
    .select({ projectId: projects.projectId, archivedAt: projects.archivedAt })
    .from(projects)
    .where(and(eq(projects.projectId, projectId), eq(projects.userEmail, email)))
    .limit(1);

  if (!ownedProject[0]) {
    return NextResponse.json({ error: "Project not found!" }, { status: 404 });
  }

  if (ownedProject[0].archivedAt) {
    return NextResponse.json({ error: "Workspace is already archived." }, { status: 409 });
  }

  await db
    .update(projects)
    .set({
      archivedAt: new Date(),
      deleteAt: getArchiveExpiryDate(new Date()),
    })
    .where(eq(projects.projectId, projectId));

  return NextResponse.json({ success: true, archived: true });
}

export async function PATCH(req: NextRequest) {
  await purgeExpiredProjects();
  const { projectId } = await req.json();
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized User!" }, { status: 401 });
  }

  if (!projectId) {
    return NextResponse.json(
      { error: "Project details missing!" },
      { status: 400 },
    );
  }

  const result = await db
    .update(projects)
    .set({ archivedAt: null, deleteAt: null })
    .where(
      and(
        eq(projects.projectId, projectId),
        eq(projects.userEmail, email),
        isNotNull(projects.archivedAt),
      ),
    )
    .returning({ projectId: projects.projectId });

  if (!result[0]) {
    return NextResponse.json({ error: "Archived workspace not found!" }, { status: 404 });
  }

  return NextResponse.json({ success: true, restored: true });
}