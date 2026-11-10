ALTER TABLE `chats` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `messages` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` integer NOT NULL;