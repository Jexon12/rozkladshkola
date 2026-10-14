// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const schedules = sqliteTable("schedules", { id: text("id").primaryKey(), data: text("data").notNull(), revision: integer("revision").notNull(), updatedAt: text("updated_at").notNull() });
export const scheduleHistory = sqliteTable("schedule_history", {revision:integer("revision").primaryKey(),data:text("data").notNull(),updatedAt:text("updated_at").notNull()});
export const pushSubscriptions = sqliteTable('push_subscriptions', {
 id:text('id').primaryKey(), tokenHash:text('token_hash').notNull(), subscription:text('subscription').notNull(), preferences:text('preferences').notNull(), createdAt:integer('created_at').notNull(), lastTest:integer('last_test').notNull().default(0),
});
export const pushJobs = sqliteTable('push_jobs', {
 id:text('id').primaryKey(), subscriptionId:text('subscription_id').notNull(), payload:text('payload').notNull(), dueAt:integer('due_at').notNull(), expiresAt:integer('expires_at').notNull(), leaseUntil:integer('lease_until').notNull().default(0), attempts:integer('attempts').notNull().default(0), sentAt:integer('sent_at'),
});
