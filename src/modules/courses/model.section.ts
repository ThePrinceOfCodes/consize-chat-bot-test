import { SectionInterface, SectionInterfaceModel } from './interfaces.section'
import mongoose, { Schema } from 'mongoose'
import { v4 } from "uuid"
import { toJSON } from '../toJSON'
import { paginate } from '../paginate'

const SectionSchema = new Schema<SectionInterface, SectionInterfaceModel>(
  {
    _id: { type: String, default: () => v4() },
    type: {
      type: String,
      required: true
    },
    content: {
      type: String,
    },
    question: {
      type: String,
    },
    options: {
      type: Array,
    },
    correctAnswer: {
      type: String,
    },
    answerExplanation: {
      type: String,
    },
    lesson: {
      type: String,
      ref: "Lessons"
    },
    course: {
      type: String,
      ref: "Course"
    },
  },
  {
    collection: 'sections',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

SectionSchema.plugin(toJSON)
SectionSchema.plugin(paginate)

const Sections = mongoose.model<SectionInterface, SectionInterfaceModel>('Sections', SectionSchema)

export default Sections
