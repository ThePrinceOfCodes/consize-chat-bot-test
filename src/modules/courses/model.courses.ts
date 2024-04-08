import { CourseInterface, CourseInterfaceModel, CourseStatus } from './interfaces.courses'
import mongoose, { Schema } from 'mongoose'
import { v4 } from "uuid"
import { toJSON } from '../toJSON'
import { paginate } from '../paginate'

const CourseSchema = new Schema<CourseInterface, CourseInterfaceModel>(
    {
        _id: { type: String, default: () => v4() },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        status: {
            type: String,
            enum: Object.values(CourseStatus),
            default: CourseStatus.DRAFT
        },
        lessons: {
            type: [String],
            default: [],
            ref: "Lessons"
        },
    },
    {
        collection: 'courses',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)
CourseSchema.index({ title: 1, description: 1 })
CourseSchema.plugin(toJSON)
CourseSchema.plugin(paginate)

const Courses = mongoose.model<CourseInterface, CourseInterfaceModel>('Courses', CourseSchema)

export default Courses
