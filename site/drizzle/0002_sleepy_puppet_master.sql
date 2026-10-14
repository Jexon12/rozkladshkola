CREATE TABLE `push_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`subscription_id` text NOT NULL,
	`payload` text NOT NULL,
	`due_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`lease_until` integer DEFAULT 0 NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`sent_at` integer
);
--> statement-breakpoint
CREATE TABLE `push_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`token_hash` text NOT NULL,
	`subscription` text NOT NULL,
	`preferences` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_test` integer DEFAULT 0 NOT NULL
);
