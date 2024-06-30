import { uuid } from 'types/base/uid';
import { Manga } from 'types/manga/manga';

export interface SourceBase {
	loading: boolean;
	getManga(mangaId: uuid): Promise<Manga | null>;
	getRecent(amount?: number, pageNumber?: number): Promise<Array<Manga>>;
	getChapters(manga: Manga): Promise<any>;
}
