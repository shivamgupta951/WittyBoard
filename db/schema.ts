import {
  varchar,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// Users are identified by email in the current schema because project records
// were created before Clerk user IDs were introduced. The API still checks the
// authenticated Clerk user before every protected operation.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  credits: integer("credits").default(10),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectId: varchar("projectId").notNull().unique(),
  projectName: varchar("projectName").notNull(),
  userEmail: varchar("userEmail").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // A soft delete keeps the workspace recoverable during the retention window.
  archivedAt: timestamp("archived_at"),
  deleteAt: timestamp("delete_at"),
});

// Excalidraw scene data is stored as JSONB because its element and app-state
// shapes evolve with the editor. The projectId unique constraint gives each
// workspace one current snapshot and supports an upsert on save.
export const whiteboardData = pgTable("whiteboardData", {
  id: serial("id").primaryKey(),
  projectId: varchar("projectid").notNull().unique().references(() => projects.projectId),
  elements: jsonb("elements"),
  appState: jsonb("appState"),
  files: jsonb("files"),
  updatedAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
