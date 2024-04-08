import { Document, Model } from 'mongoose'
import { QueryResult } from '../paginate/paginate'

interface Enrollment {
  course: string;
  userMobile: string
}

export interface EnrollmentInterface extends Enrollment, Document {
  _id: string
  createdAt?: Date
  updatedAt?: Date
}

export interface EnrollmentInterfaceModel extends Model<EnrollmentInterface> {
  paginate (filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult<EnrollmentInterface>>
}