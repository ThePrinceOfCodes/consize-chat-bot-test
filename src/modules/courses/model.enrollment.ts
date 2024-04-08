import mongoose, { Schema } from 'mongoose'
import { v4 } from "uuid"
import { toJSON } from '../toJSON'
import { paginate } from '../paginate'
import { EnrollmentInterface, EnrollmentInterfaceModel } from './interface.enrollment'

const EnrollmentSchema = new Schema<EnrollmentInterface, EnrollmentInterfaceModel>(
  {
    _id: { type: String, default: () => v4() },
    course: {
      type: String,
      required: true
    },
    userMobile: {
      type: String,
      required: true
    },
    
  },
  {
    collection: 'enrollments',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

EnrollmentSchema.plugin(toJSON)
EnrollmentSchema.plugin(paginate)

const Enrollment = mongoose.model<EnrollmentInterface, EnrollmentInterfaceModel>('Enrollment', EnrollmentSchema)

export default Enrollment
