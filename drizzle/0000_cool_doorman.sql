CREATE TABLE IF NOT EXISTS `manga` (
	`id` text PRIMARY KEY NOT NULL,
	`manga_id` text NOT NULL,
	`source_id` text NOT NULL,
	`title` text NOT NULL,
	`author` text,
	`artist` text,
	`description` text,
	`last_read` text,
	`date_added` text DEFAULT CURRENT_TIMESTAMP,
	`last_updated` text,
	`tags` text NOT NULL,
	`read_status` text NOT NULL,
	`content_status` text NOT NULL,
	`content_rating` text NOT NULL,
	`url` text NOT NULL,
	`cover_url` text
);
