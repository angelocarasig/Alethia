import { create } from 'zustand';
import * as Crypto from 'expo-crypto';

import { desc, eq } from 'drizzle-orm';
import { db } from 'db/client';
import { mangaTable, type SelectManga } from 'db/schema';

import { Manga, Tag, ReadStatus, ContentStatus, ContentRating } from 'types/manga';

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
		mangaInLibrary: (manga: Manga) => boolean;
	};
};

const useMangaStore = create<DatabaseStore>((set, get) => {
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

		set((state) => ({
			library: [...state.library, manga]
		}));
	};

	const deleteFromLibrary = (manga: Manga) => {
		db.delete(mangaTable).where(eq(mangaTable.title, manga.title)).run();

		refreshLibrary();
	};

	const mangaInLibrary = (manga: Manga) => {
		const library = get().library;
		return library.some((item) => item.title === manga.title);
	};

	try {
		return {
			library: fetchLibrary.all().map(mapSelectMangaToManga),
			actions: {
				refreshLibrary,
				addToLibrary,
				deleteFromLibrary,
				mangaInLibrary
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
				mangaInLibrary
			}
		};
	}
});

export const useLibrary = () => useMangaStore((state) => state.library);
export const useLibraryActions = () => useMangaStore((state) => state.actions);

const useDatabase = () => {
	const library = useLibrary();
	const { refreshLibrary, addToLibrary, deleteFromLibrary, mangaInLibrary } = useLibraryActions();

	return {
		library,
		refreshLibrary,
		addToLibrary,
		deleteFromLibrary,
		mangaInLibrary
	};
};

export default useDatabase;
