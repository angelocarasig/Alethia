import { create } from 'zustand';
import * as Crypto from 'expo-crypto';

import { desc, eq } from 'drizzle-orm';
import { db } from 'db/client';
import { mangaTable, type SelectManga } from 'db/schema';

import { Manga, Tag, ReadStatus, ContentStatus, ContentRating } from 'types/manga';
import { uuid } from 'types/base/uid';
import { useEffect } from 'react';

const mapSelectMangaToManga = (selectManga: SelectManga): Manga => {
	return {
		id: selectManga.id,
		sourceId: selectManga.sourceId,
		title: selectManga.title,
		author: selectManga.author ?? '',
		artist: selectManga.artist ?? '',
		description: selectManga.description ?? '',
		lastRead: selectManga.lastRead ? new Date(selectManga.lastRead) : undefined,
		dateAdded: new Date(selectManga.dateAdded ?? ''),
		lastUpdated: selectManga.lastUpdated ? new Date(selectManga.lastUpdated) : undefined,
		tags: JSON.parse(selectManga.tags) as Tag[],
		readStatus: selectManga.readStatus as ReadStatus,
		contentStatus: selectManga.contentStatus as ContentStatus,
		contentRating: selectManga.contentRating as ContentRating,
		url: selectManga.url,
		coverUrl: selectManga.coverUrl ?? ''
	};
};

type DatabaseStore = {
	library: Manga[];
	actions: {
		refreshLibrary: () => void;
		addToLibrary: (manga: Manga) => void;
    deleteFromLibrary: (manga: Manga) => void;
		getManga: (mangaId: string) => Manga | null;
	};
};

const useMangaStore = create<DatabaseStore>((set) => {
	const fetchLibrary = db.select().from(mangaTable).orderBy(desc(mangaTable.id));

	const refreshLibrary = () => {
		const library = fetchLibrary.all().map(mapSelectMangaToManga);
		set({ library });
	};

	const addToLibrary = (manga: Manga) => {
		db.insert(mangaTable)
			.values({
				id: Crypto.randomUUID(),
        mangaId: manga.id,
				sourceId: manga.sourceId,
				title: manga.title,
				author: manga.author,
				artist: manga.artist,
				description: manga.description,
				lastRead: manga.lastRead?.toISOString(),
				dateAdded: manga.dateAdded?.toISOString() || new Date().toISOString(),
				lastUpdated: manga.lastUpdated?.toISOString(),
				tags: JSON.stringify(manga.tags),
				readStatus: manga.readStatus,
				contentStatus: manga.contentStatus,
				contentRating: manga.contentRating,
				url: manga.url,
				coverUrl: manga.coverUrl
			})
			.run();

		refreshLibrary();
	};

  const deleteFromLibrary = (manga: Manga) => {
    db.delete(mangaTable)
      .where(eq(mangaTable.title, manga.title))
      .run();

    refreshLibrary();
  };

	const getManga = (mangaId: uuid): Manga | null => {
		const result = db.select().from(mangaTable).where(eq(mangaTable.id, mangaId)).get();

		return result ? mapSelectMangaToManga(result) : null;
	};

	try {
		return {
			library: fetchLibrary.all().map(mapSelectMangaToManga),
			actions: {
				refreshLibrary,
				addToLibrary,
        deleteFromLibrary,
				getManga
			}
		};
	} catch (error) {
		console.error('Failed to fetch library:', error);
		return {
			library: [],
			actions: {
				refreshLibrary,
				addToLibrary,
        deleteFromLibrary,
				getManga
			}
		};
	}
});

export const useLibrary = () => useMangaStore((state) => state.library);
export const useLibraryActions = () => useMangaStore((state) => state.actions);

const useDatabase = () => {
	const library = useLibrary();
	const { refreshLibrary, addToLibrary, deleteFromLibrary, getManga } = useLibraryActions();

  const mangaInLibrary = (manga: Manga) => {
    return library.some(x => x.title === manga.title);
  }

	return {
		library,
		getManga,
		refreshLibrary,
		addToLibrary,
    deleteFromLibrary,
    mangaInLibrary,
	};
};

export default useDatabase;
