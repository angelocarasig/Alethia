import { uuid } from 'types/base/uid';
import { RelationshipType } from './relationshipType';

export interface Relationship {
	id: uuid;
	type: RelationshipType;
	attributes?: { [key: string]: string };
}
