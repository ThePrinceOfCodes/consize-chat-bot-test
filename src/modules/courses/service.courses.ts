import { CourseInterface, CreateCoursePayload } from './interfaces.courses'
import Course from './model.courses'
import { CreateLessonPayload, LessonInterface } from './interfaces.lessons'
import Lessons from './model.lessons'
import { BlockInterface, CreateBlockPayload } from './interfaces.section'
import Blocks from './model.section'
import { CreateQuizPayload, QuizInterface } from './interfaces.quizzes'
import Quizzes from './model.quizzes'
import axios from 'axios'

export const createCourse = async (coursePayload: CreateCoursePayload, teamId: string): Promise<CourseInterface> => {
  const course = new Course({ ...coursePayload, owner: teamId })
  await course.save()
  return course
}


// lessons

export const createLesson = async (lessonPayload: CreateLessonPayload, course: string): Promise<LessonInterface> => {
  const lesson = new Lessons({ ...lessonPayload, course })
  await Course.findByIdAndUpdate(course, { $push: { lessons: lesson.id } })
  await lesson.save()
  return lesson
}


export const fetchCourseLessons = async ({ course }: { course: string }): Promise<LessonInterface[]> => {
  const results = await Lessons.find({ course }).populate("blocks").populate("course")
  return results
}

export const fetchSingleLesson = async ({ lesson }: { lesson: string }): Promise<LessonInterface | null> => {
  return Lessons.findById(lesson).populate({
    path: "blocks",
    populate: {
      path: "quiz"
    }
  }).populate("course").populate("quizzes")
}


export const fetchLessonsQuiz = async (lesson: string): Promise<QuizInterface[]> => {
  return await Quizzes.find({ lesson: lesson })
}
// blocks


export const createBlock = async (blockPayload: CreateBlockPayload, lesson: string, course: string): Promise<BlockInterface> => {
  const block = new Blocks({ ...blockPayload, lesson, course })
  await Lessons.findByIdAndUpdate(lesson, { $push: { blocks: block.id } })
  await block.save()
  return block
}


export const fetchLessonsBlocks = async ({ course, lesson }: { course: string, lesson: string }): Promise<BlockInterface[]> => {
  const results = await Blocks.find({ course, lesson }).populate("quiz").populate("lesson").populate("course")
  return results
}

export const deleteBlockFromLesson = async function (block: string, lesson: string) {
  await Lessons.findByIdAndUpdate(lesson, { $pull: { blocks: block } }, { new: true })
  await Blocks.findByIdAndDelete(block)
}

export const fetchSingleLessonBlock = async ({ block }: { block: string }): Promise<LessonInterface | null> => {
  return Blocks.findById(block).populate("quiz").populate("lesson").populate("course")
}

// Quizzes
export const addLessonQuiz = async (quizPayload: CreateQuizPayload, lesson: string, course: string): Promise<QuizInterface> => {
  const quiz = new Quizzes({ ...quizPayload, lesson, course })
  await Lessons.findByIdAndUpdate(lesson, { $push: { quizzes: quiz.id } })
  await quiz.save()
  return quiz
}

export const addBlockQuiz = async (quizPayload: CreateQuizPayload, lesson: string, course: string, block: string): Promise<QuizInterface> => {
  const quiz = new Quizzes({ ...quizPayload, lesson, course, block })
  await Blocks.findByIdAndUpdate(block, { $set: { quiz: quiz.id } })
  await quiz.save()
  return quiz
}

export const updateQuiz = async (quiz: string, body: any): Promise<void> => {
  await Quizzes.findByIdAndUpdate(quiz, { $set: { ...body } })
}

export const sendWhatsAppMessage = async(to:string, message:string, token:string, business_phone_number_id:string):Promise<void>=>{
  await axios({
    method: "POST",
    url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      messaging_product: "whatsapp",
      to: to,
      text: { body: message },
    },
  });
}
