import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "editor", "viewer"]);

// Tables
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: userRoleEnum("role").default("viewer").notNull(),
  orgId: integer("org_id").references(() => organizations.id),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<"oauth" | "oidc" | "email">().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id")
    .references(() => organizations.id)
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  stackProfile: jsonb("stack_profile"),
});

export const projectIntake = pgTable("project_intake", {
  id: serial("id").notNull(), // Keep the serial ID, but it's not the PK
  projectId: integer("project_id")
    .references(() => projects.id)
    .notNull(),
  section: varchar("section", { length: 256 }).notNull(),
  payload: jsonb("payload").notNull(),
  isValid: boolean("valid").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    // Define a composite primary key for the upsert logic
    pk: primaryKey({ columns: [table.projectId, table.section] }),
  };
});

export const kbDocuments = pgTable("kb_documents", {
  id: serial("id").primaryKey(),
  chapterId: varchar("chapter_id", { length: 100 }).unique().notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  json: jsonb("json").notNull(),
  routingTopics: text("routing_topics").array(),
  qualityAttributes: text("quality_attributes").array(),
  lang: varchar("lang", { length: 10 }).default("fa").notNull(),
});

export const kbChunks = pgTable("kb_chunks", {
  id: text("id").primaryKey(), // Using a deterministic ID like `chapterId-chunkId`
  chapterId: varchar("chapter_id", { length: 100 }).notNull(),
  sectionId: varchar("section_id", { length: 100 }),
  tags: text("tags").array(),
  routingTopics: text("routing_topics").array(),
  qualityAttributes: text("quality_attributes").array(),
  text: text("text").notNull(),
  numbers: jsonb("numbers"),
  textPreview: text("text_preview"),
  lang: varchar("lang", { length: 10 }).default("fa").notNull(),
  // The 'embedding' column will be added conditionally if pgvector is enabled.
});

export const promptPacks = pgTable("prompt_packs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id)
    .notNull(),
  version: varchar("version", { length: 50 }).notNull(),
  json: jsonb("json").notNull(),
  md: text("md").notNull(),
  citations: jsonb("citations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const evalRuns = pgTable("eval_runs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id)
    .notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  metrics: jsonb("metrics").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const organizationRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  projects: many(projects),
}));

export const userRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.orgId],
    references: [organizations.id],
  }),
}));

export const projectRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.orgId],
    references: [organizations.id],
  }),
  intakes: many(projectIntake),
  promptPacks: many(promptPacks),
  evalRuns: many(evalRuns),
}));

export const projectIntakeRelations = relations(projectIntake, ({ one }) => ({
  project: one(projects, {
    fields: [projectIntake.projectId],
    references: [projects.id],
  }),
}));

export const promptPackRelations = relations(promptPacks, ({ one }) => ({
  project: one(projects, {
    fields: [promptPacks.projectId],
    references: [projects.id],
  }),
}));

export const evalRunRelations = relations(evalRuns, ({ one }) => ({
  project: one(projects, {
    fields: [evalRuns.projectId],
    references: [projects.id],
  }),
}));
