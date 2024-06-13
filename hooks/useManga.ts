import { Manga } from 'types/manga';

import { create } from 'zustand';

type MangaStore = {
	selectedManga: Manga | null;
	setSelectedManga: (manga: Manga) => void;
};

const useMangaStore = create<MangaStore>((set) => ({
	selectedManga: null,
	setSelectedManga: (manga: Manga) => set({ selectedManga: manga })
}));

export const useManga = () => {
	const selectedManga = useMangaStore((state) => state.selectedManga);
	const setSelectedManga = useMangaStore((state) => state.setSelectedManga);

	return { selectedManga, setSelectedManga };
};
