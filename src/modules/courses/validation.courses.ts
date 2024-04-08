import Joi from 'joi'
import { CreateCoursePayload } from './interfaces.courses'
import { CreateLessonPayload } from './interfaces.lessons'
import { CreateSectionPayload } from './interfaces.section'

const createCourseRequest: Record<keyof CreateCoursePayload, any> = {
  title: Joi.string().required(),
  description: Joi.string().required(),
}

export const createCourse = {
  body: Joi.object().keys(createCourseRequest),
}

export const createLesson = {
  body: Joi.object<CreateLessonPayload>().keys({
    title: Joi.string().required(),
    description: Joi.string().optional().allow("")
  }),
  params: Joi.object().keys({
    course: Joi.string().required()
  })
}


// create sections
export const createSection = {
  body: Joi.object<CreateSectionPayload>().keys({
    type: Joi.string().required(),
    content: Joi.string().optional(),
    question: Joi.string().optional(),
    options: Joi.array().optional(),
    correctAnswer: Joi.string().optional(),
    answerExplanation: Joi.string().optional(),
  }),
  params: Joi.object().keys({
    course: Joi.string().required(),
    lesson: Joi.string().required(),
  })
}
