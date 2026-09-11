import { db, projects, users, whiteboardData } from "@/db";
import { count, eq, isNotNull } from "drizzle-orm";
import { MAX_WORKSPACES } from "@/lib/constants";

export const ARCHIVE_RETENTION_DAYS = 7;

// The deadline is calculated once when a workspace is archived. Persisting it
// makes the countdown stable across refreshes and lets a cron job enforce it.
export function getArchiveExpiryDate(archivedAt: Date) {
  return new Date(
    archivedAt.getTime() + ARCHIVE_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  );
}

export async function purgeExpiredProjects() {
  // This fallback cleanup also runs during normal API traffic. The scheduled
  // route handles production cleanup, while this keeps local development useful.
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

    // Older archived rows predate deleteAt, so backfill their deadline lazily.
    if (!project.deleteAt) {
      await db
        .update(projects)
        .set({ deleteAt })
        .where(eq(projects.projectId, project.projectId));
    }

    if (deleteAt > now) continue;

    // Whiteboard data has a foreign-key relationship to the project, so remove
    // the child row first before permanently deleting the project row.
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
