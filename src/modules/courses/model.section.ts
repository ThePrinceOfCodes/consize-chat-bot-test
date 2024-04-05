import { BlockInterface, BlockInterfaceModel } from './interfaces.section'
import mongoose, { Schema } from 'mongoose'
import { v4 } from "uuid"
import { toJSON } from '../toJSON'
import { paginate } from '../paginate'
import { MediaSchema } from './model.courses'

const BlockSchema = new Schema<BlockInterface, BlockInterfaceModel>(
  {
    _id: { type: String, default: () => v4() },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    lesson: {
      type: String,
      ref: "Lessons"
    },
    quiz: {
      type: String,
      ref: "Quizzes"
    },
    course: {
      type: String,
      ref: "Courses"
    },
    bodyMedia: {
      type: MediaSchema
    }
  },
  {
    collection: 'blocks',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

BlockSchema.plugin(toJSON)
BlockSchema.plugin(paginate)

const Blocks = mongoose.model<BlockInterface, BlockInterfaceModel>('Blocks', BlockSchema)

export default Blocks
