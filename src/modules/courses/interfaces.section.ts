import { Document, Model } from 'mongoose'
import { QueryResult } from '../paginate/paginate'

export enum SectionType {
  TEXT = "text",
  QUIZ = "quiz"
}

interface Section {
  type: string;
  content?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  answerExplanation?: string;
  lesson: string;
  course: string
}

export interface CreateSectionPayload {
  type: string;
  content?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  answerExplanation?: string;
  lesson: string;
  course: string;
}

export interface SectionInterface extends Section, Document {
  _id: string
  createdAt?: Date
  updatedAt?: Date
}

export interface SectionInterfaceModel extends Model<SectionInterface> {
  paginate (filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult<SectionInterface>>
}