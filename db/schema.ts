import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const mangaTable = sqliteTable('manga', {
	id: text('id').primaryKey(),
	mangaId: text('manga_id').notNull(),
	sourceId: text('source_id').notNull(),
	title: text('title').notNull(),
	author: text('author'),
	artist: text('artist'),
	description: text('description'),
	lastRead: text('last_read'),
	dateAdded: text('date_added').default(sql`CURRENT_TIMESTAMP`),
	lastUpdated: text('last_updated'),
	tags: text('tags').notNull(), // Assuming tags are stored as a JSON string
	readStatus: text('read_status').notNull(),
	contentStatus: text('content_status').notNull(),
	contentRating: text('content_rating').notNull(),
	url: text('url').notNull(),
	coverUrl: text('cover_url'),
});

export type SelectManga = typeof mangaTable.$inferSelect;
