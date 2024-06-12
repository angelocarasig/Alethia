import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite/next';

const mangaDb = openDatabaseSync('manga.db');

export const db = drizzle(mangaDb);
