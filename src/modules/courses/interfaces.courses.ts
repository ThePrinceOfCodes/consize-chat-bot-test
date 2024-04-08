import { Document, Model } from 'mongoose'
import { QueryResult } from '../paginate/paginate'


export enum CourseStatus {
    DRAFT = "draft",
    COMPLETED = "completed",
    PUBLISHED = "published",
    DELETED = "deleted"
}

interface Course {
    title: string
    description: string
    lessons: string[]
    status: CourseStatus
}

export interface CreateCoursePayload {
    title: string
    description: string
}

export interface CourseInterface extends Course, Document {
    _id: string
    createdAt?: Date
    updatedAt?: Date
}


export interface CourseInterfaceModel extends Model<CourseInterface> {
    paginate (filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult<CourseInterface>>
}