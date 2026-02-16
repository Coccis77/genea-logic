export interface Document {
  id: string;
  type: 'birth_certificate' | 'marriage_certificate' | 'newspaper' | 'census' | 'photo' | 'audio' | 'other';
  title: string;
  content?: string;
  audioUrl?: string;
  imageUrl?: string;
}

export type Gender = 'male' | 'female' | 'unknown';

export interface Person {
  id: string;
  displayName: string;
  knownFacts: string[];
  position: { x: number; y: number };
  gender: Gender;
}

export type CoupleType = 'married' | 'partnership' | 'affair' | 'divorced';

export interface CoupleRelationship {
  id: string;
  type: CoupleType;
  person1Id: string;
  person2Id: string;
}

export type ChildType = 'biological' | 'adopted';

export interface ChildRelationship {
  id: string;
  coupleId?: string;
  parentId?: string;
  childId: string;
  type?: ChildType;
}

export interface Solution {
  couples: CoupleRelationship[];
  children: ChildRelationship[];
}

export interface ValidationRules {
  requiredRelationships: number;
  totalPoints: number;
}

export interface Level {
  levelId: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  documents: Document[];
  initialPeople: Person[];
  solutionEncoded: string;
  validationRules: ValidationRules;
}

export type ConnectionMode = 'select' | 'married' | 'partnership' | 'affair' | 'divorced' | 'child' | 'adopted' | 'remove';
