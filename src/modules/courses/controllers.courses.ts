import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import * as courseService from './service.courses'
import httpStatus from 'http-status'
import config from '../../config/config'
import * as whatsappService from '../whatsapp/service.whatsapp'


export const createCourseManually = catchAsync(async (req: Request, res: Response) => {
  const createdCourse = await courseService.createCourse(req.body, req.user.team)
  res.status(httpStatus.CREATED).send({ data: createdCourse, message: "Course created successfully" })
})


// lessons
export const addLessonToCourse = catchAsync(async (req: Request, res: Response) => {
  if (req.params['course']) {
    const createdLesson = await courseService.createLesson(req.body, req.params["course"])
    res.status(httpStatus.CREATED).send({ data: createdLesson, message: "Your lesson has been added successfully" })
  }
})

export const fetchCourseLessons = catchAsync(async (req: Request, res: Response) => {
  if (req.params['course']) {
    const lessons = await courseService.fetchCourseLessons({ course: req.params['course'] })
    res.status(httpStatus.CREATED).send({ data: lessons, message: "Here are your lessons" })
  }
})

export const fetchSingleCourseLesson = catchAsync(async (req: Request, res: Response) => {
  if (req.params['lesson']) {
    const lessons = await courseService.fetchSingleLesson({ lesson: req.params['lesson'] })
    res.status(httpStatus.CREATED).send({ data: lessons, message: "Here you are" })
  }
})

export const addBlockToLesson = catchAsync(async (req: Request, res: Response) => {
  const { lesson, course } = req.params

  if (lesson && course) {
    const createdBlock = await courseService.createBlock(req.body, lesson, course)
    res.status(httpStatus.OK).send({ data: createdBlock, message: "Your block has been created successfully" })
  }
})

export const fetchLessonsBlocks = catchAsync(async (req: Request, res: Response) => {
  const { course, lesson } = req.params
  if (lesson && course) {
    const blocks = await courseService.fetchLessonsBlocks({ course: course, lesson: lesson })
    res.status(httpStatus.OK).send({ data: blocks, message: "block retrieved successfully" })
  }
})

export const fetchLessonsQuiz = catchAsync(async (req: Request, res: Response) => {
  const { lesson } = req.params
  if (lesson) {
    const quizzes = await courseService.fetchLessonsQuiz(lesson)
    res.status(httpStatus.OK).send({ data: quizzes, message: "quizzes retrieved successfully" })
  }
})

export const addQuizToBlock = catchAsync(async (req: Request, res: Response) => {
  const { block, lesson, course } = req.params

  if (block && lesson && course) {
    const quiz = await courseService.addBlockQuiz(req.body, lesson, course, block)
    res.status(httpStatus.CREATED).send({ data: quiz, message: "Your quiz has been created successfully" })
  }
})


export const addQuizToLesson = catchAsync(async (req: Request, res: Response) => {
  const { lesson, course } = req.params

  if (lesson && course) {
    const quiz = await courseService.addLessonQuiz(req.body, lesson, course)
    res.status(httpStatus.CREATED).send({ data: quiz, message: "Quiz added to lesson" })
  }
})

export const webhook = catchAsync(async (req: Request, res: Response) => {
  let mode = req.query["hub.mode"]
  let challenge = req.query["hub.challenge"]
  let token = req.query["hub.verify_token"]

  const myToken: string = "concise"

  if (mode === "subscribe" && token === myToken) {
  res.status(200).send(challenge)
  } else {
    res.send(403)
  }
 
})


export const postWebhook = catchAsync(async (req: Request, res: Response) => {
  const whatsAppToken = config.whatsAppToken
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message?.type === "text") {
  
    const business_phone_number_id = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
    const customerNumber = message.from

    const userResponse = message.text.body.trim().toUpperCase(); // Extract user's response and convert to uppercase for comparison

    // check the user's response against the correct answer
    let feedbackMessage = "";
    let nextQuestion = "";

    if (userResponse === "B") { // Assuming "B" is the correct answer
      feedbackMessage = "Correct answer! Well done!";
      nextQuestion = "Next question: What is the capital of Italy?\n\nA) Rome\nB) Paris\nC) Berlin\nD) Madrid"; // Example next question
    } else {
      feedbackMessage = "Incorrect answer. Try again!";
      nextQuestion = "Retry: What is the capital of France?\n\nA) London\nB) Paris\nC) Berlin\nD) Madrid"; // Retry the same question
    }

    // send feedback message
    await whatsappService.sendWhatsAppMessage(customerNumber, feedbackMessage, whatsAppToken,business_phone_number_id);

    // send next quiz question
    await whatsappService.sendWhatsAppMessage(customerNumber, nextQuestion, whatsAppToken,business_phone_number_id);

  }

  res.sendStatus(200);
})

