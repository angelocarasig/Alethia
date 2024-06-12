import { uuid } from 'types/base/uid';

import { Tag } from './tag';
import { ContentStatus, ReadStatus } from './status';
import { ContentRating } from './contentRating';

export interface Manga {
  /**
   * ID of the manga - related to `manga.sourceId`
   */
  id: uuid;

  /**
   * Source ID of the manga - the source ID the manga originates from
   */
  sourceId: string;
  
  title: string; // TODO: Alt titles

  author?: string;
  artist?: string;

  description?: string;

  lastRead?: Date;
  dateAdded?: Date;
  lastUpdated?: Date;

  tags: Array<Tag>;

  readStatus: ReadStatus;
  contentStatus: ContentStatus;
  contentRating: ContentRating;

  /**
   * Optional URL `string` to the cover url of the manga
   */
  coverUrl?: string;
}
