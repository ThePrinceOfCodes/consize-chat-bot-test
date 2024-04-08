import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import * as courseService from './service.courses'
import httpStatus from 'http-status'
import { Enrollment } from '.'
import { whatsappService } from '../whatsapp'


export const createCourse = catchAsync(async (req: Request, res: Response) => {
  const createdCourse = await courseService.createCourse(req.body)
  res.status(httpStatus.CREATED).send({ data: createdCourse, message: "Course created successfully" })
})

// lessons
export const addLessonToCourse = catchAsync(async (req: Request, res: Response) => {
  if (req.params['course']) {
    const createdLesson = await courseService.createLesson(req.body, req.params["course"])
    res.status(httpStatus.CREATED).send({ data: createdLesson, message: "Your lesson has been added successfully" })
  }
})

export const addSectionToLesson = catchAsync(async (req: Request, res: Response) => {
  const { lesson, course } = req.params

  if (lesson && course) {
    const createdSection = await courseService.createSection(req.body, lesson, course)
    await courseService.updateCourseFlow(course)
    res.status(httpStatus.OK).send({ data: createdSection, message: "Your section has been created successfully" })
  }
})

export const enrollUser = catchAsync(async (req: Request, res: Response) => {
  const { course } = req.params
  const userMobile = req.body.userMobile

  if (course) {
    const enrollment = new Enrollment({ userMobile: userMobile, course: course}) 
    await enrollment.save()

    await whatsappService.sendWelcomeMessage(userMobile)

    res.status(httpStatus.OK).send({message: "user enrolled"})
  }
})

