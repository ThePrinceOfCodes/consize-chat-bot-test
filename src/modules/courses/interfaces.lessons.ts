import { Document, Model } from 'mongoose'
import { QueryResult } from '../paginate/paginate'


interface Lesson {
  title: string
  description: string
  sections: string[]
  course: string
}

export interface CreateLessonPayload {
  title: string
  description?: string
  course: string
}

export interface LessonInterface extends Lesson, Document {
  _id: string
  createdAt?: Date
  updatedAt?: Date
}


export interface LessonInterfaceModel extends Model<LessonInterface> {
  paginate (filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult<LessonInterface>>
}