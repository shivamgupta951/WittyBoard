import { db, projects, users, whiteboardData } from "@/db";
import { count, eq, isNotNull } from "drizzle-orm";
import { MAX_WORKSPACES } from "@/lib/constants";

export const ARCHIVE_RETENTION_DAYS = 7;

export function getArchiveExpiryDate(archivedAt: Date) {
  return new Date(
    archivedAt.getTime() + ARCHIVE_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  );
}

export async function purgeExpiredProjects() {
  const now = new Date();
  const archivedProjects = await db
    .select({
      projectId: projects.projectId,
      userEmail: projects.userEmail,
      archivedAt: projects.archivedAt,
      deleteAt: projects.deleteAt,
    })
    .from(projects)
    .where(isNotNull(projects.archivedAt));

  for (const project of archivedProjects) {
    const deleteAt =
      project.deleteAt ??
      (project.archivedAt ? getArchiveExpiryDate(project.archivedAt) : null);

    if (!deleteAt) continue;

    if (!project.deleteAt) {
      await db
        .update(projects)
        .set({ deleteAt })
        .where(eq(projects.projectId, project.projectId));
    }

    if (deleteAt > now) continue;

    await db
      .delete(whiteboardData)
      .where(eq(whiteboardData.projectId, project.projectId));
    await db
      .delete(projects)
      .where(eq(projects.projectId, project.projectId));

    const remaining = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.userEmail, project.userEmail));

    await db
      .update(users)
      .set({
        credits: Math.max(
          0,
          MAX_WORKSPACES - Number(remaining[0]?.count ?? 0),
        ),
      })
      .where(eq(users.email, project.userEmail));
  }
}
