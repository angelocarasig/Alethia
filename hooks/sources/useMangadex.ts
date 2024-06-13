import { useState } from 'react';

import { SourceBase } from './base';

import { uuid } from 'types/base/uid';
import { Manga } from 'types/manga/manga';
import { ContentStatus, ReadStatus } from 'types/manga/status';
import { ContentRating } from 'types/manga/contentRating';

enum MangadexStatus {
  COMPLETED = "completed", 
  ONGOING = "ongoing",
  CANCELLED = "cancelled", 
  HIATUS = "hiatus"
}

enum MangadexContentRating {
  SAFE = "safe", 
  SUGGESTIVE = "suggestive", 
  EROTICA = "erotica", 
  PORNOGRAPHIC = "pornographic"
}

type MangadexTagAttributes = {
  name: { [key: string]: string };
  description: string;
}

//NOTE: Types of { [key: string]: string } usually depicts a language code followed by the resulting value
type MangadexDataResponse = {
  id: uuid;
  type: 'manga';
  attributes: {
    title: { [key: string]: string },
    description: { [key: string]: string },
    status: MangadexStatus,
    contentRating: MangadexContentRating,
    tags: [{ id: uuid, type: 'tag', attributes: MangadexTagAttributes }],

    createdAt: string // Need to convert to date
    updatedAt: string // Need to convert to date
  }
  relationships: [{
    id: uuid;
    type: 'author' | 'artist' | 'cover_art';
    attributes: { [key: string]: string }
  }]
}

const mapMangadexStatusToContentStatus = (status: MangadexStatus): ContentStatus => {
  switch (status) {
    case MangadexStatus.COMPLETED:
      return ContentStatus.Completed;
    case MangadexStatus.ONGOING:
      return ContentStatus.Ongoing;
    case MangadexStatus.CANCELLED:
      return ContentStatus.Cancelled;
    case MangadexStatus.HIATUS:
      return ContentStatus.Hiatus;
    default:
      throw new Error(`Unknown MangadexStatus: ${status}`);
  }
};


const resultToManga = (result: MangadexDataResponse | Array<MangadexDataResponse>) => {
  const mapResponse = (res: MangadexDataResponse): Manga => {
    return {
      id: res.id,
      sourceId: 'alethia.mangadex',
      
      title: res.attributes.title.en || res.attributes.title['ja'],
      author: res.relationships.find(x => x.type === 'author')?.attributes.name || '',
      artist: res.relationships.find(x => x.type === 'artist')?.attributes.name || '',
      url: `https://mangadex.org/manga/${res.id}`,
      coverUrl: `https://mangadex.org/covers/${res.id}/${res.relationships.find(x => x.type === 'cover_art')?.attributes.fileName}`,

      description: res.attributes.description['en'],

      lastRead: new Date(-1),
      dateAdded: new Date(res.attributes.createdAt),
      lastUpdated: new Date(res.attributes.updatedAt),

      tags: res.attributes.tags.map(tag => { return { title: tag.attributes.name.en } }),

      readStatus: ReadStatus.PlanningToRead,
      contentStatus: mapMangadexStatusToContentStatus(res.attributes.status),
      contentRating: ContentRating.Safe
    };
  }

  return Array.isArray(result) ? result.map(x => mapResponse(x)) : mapResponse(result);
}

export function useMangadex(): SourceBase {
  const [mangas, setMangas] = useState<Array<Manga>>([]);
	const [loading, setLoading] = useState(false);

	const getManga = async (mangaId: string) => {
    setLoading(true);
		const manga = mangas.find(manga => manga.id === mangaId);

    if (manga != null) {
      return manga;
    }

    const API_BASE = new URL(`https://api.mangadex.org/manga/${mangaId}`);
		const searchParams = new URLSearchParams();
		['cover_art', 'author', 'artist'].forEach(include => {
      searchParams.append('includes[]', include);
    });
		API_BASE.search = searchParams.toString();
    const response = await fetch(API_BASE.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'default'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();

    console.log("Res: ", res.data);

    const newManga = resultToManga(res.data) as Manga;
    setLoading(false);
    return newManga;
	};

	const getRecent = async (amount?: number): Promise<Array<Manga>> => {
		setLoading(true);

		const API_BASE = new URL('https://api.mangadex.org/manga');
		const params = {
			limit: amount != null ? amount.toString() : '60',
		};
		const searchParams = new URLSearchParams();
		['cover_art', 'author', 'artist'].forEach(include => {
      searchParams.append('includes[]', include);
    });
    searchParams.append('limit', params.limit);

		API_BASE.search = searchParams.toString();

		try {
			const response = await fetch(API_BASE.toString(), {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const res = await response.json();

			const newManga = resultToManga(res.data) as Array<Manga>;
      setMangas(newManga);
			setLoading(false);
      return newManga;
		} catch (error) {
			console.error('Error:', error);

			setLoading(false);
			return [];
		}
	};

	return {
		loading,
		getManga,
		getRecent
	};
}
