import { jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const userProjects = pgTable('user_projects', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 512 }),
  tags: text('tags').array().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const files = pgTable('files', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  projectId: varchar('project_id', { length: 255 }),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 512 }),
  tags: text('tags').array().notNull().default([]),
  url: varchar('url', { length: 255 }).notNull(),
  parsedContent: text('parsed_content'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
