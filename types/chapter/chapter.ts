import { uuid } from "types/base/uid";
import { Relationship } from "./relationship";

export interface Chapter {
  id: uuid;
  type: 'chapter';
  attributes: {
    volume: string | null;
    chapter: string;
    title: string | null;
    translatedLanguage: 'en';
    externalUrl: string | null;
    publishAt: string;
    readableAt: string;
    createdAt: string;
    updatedAt: string;
    pages: number;
    version: number;
  };
  relationships: Relationship[];
}