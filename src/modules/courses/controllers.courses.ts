import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import * as courseService from './service.courses'
import httpStatus from 'http-status'
import axios from 'axios'


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
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  // check if the incoming message contains text
  if (message?.type === "text") {
    // extract the business number to send the reply from it
    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${"EAANjPOZAZBbccBO8vcZCSVGhNHd57b7sLWtNs8eL3vviX3vnKZBnlEI4deijKLni4OJGXU1SqO0rF8IvWqqG1EY7QEuYQ99kNRCq33ewKKXF9NOmU56HqwotMKSZBwg1n9quefpmZCohCaox3Ybq4dZBgCjwGC9pW62netVPHD0rA6eveb8obaZCdZCfps1QOAzMjhiXOfsN07U5KaVQImvqM8wZDZD"}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: message.from,
        text: { body: "Echo: " + message.text.body },
        context: {
          message_id: message.id, // shows the message as a reply to the original user message
        },
      },
    });

    // mark incoming message as read
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${"EAANjPOZAZBbccBO8vcZCSVGhNHd57b7sLWtNs8eL3vviX3vnKZBnlEI4deijKLni4OJGXU1SqO0rF8IvWqqG1EY7QEuYQ99kNRCq33ewKKXF9NOmU56HqwotMKSZBwg1n9quefpmZCohCaox3Ybq4dZBgCjwGC9pW62netVPHD0rA6eveb8obaZCdZCfps1QOAzMjhiXOfsN07U5KaVQImvqM8wZDZD"}`,
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.id,
      },
    });
  }

  res.sendStatus(200);
})

