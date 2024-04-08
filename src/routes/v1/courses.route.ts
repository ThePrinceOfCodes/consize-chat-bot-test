import express, { Router } from 'express'
import { validate } from '../../modules/validate'
import { courseControllers, courseValidators } from "../../modules/courses"

const router: Router = express.Router()
router.post('/', validate(courseValidators.createCourse), courseControllers.createCourse)
router.post('/create-lesson/:course', validate(courseValidators.createLesson), courseControllers.addLessonToCourse)
router.post('/create-section/:course/:lesson', validate(courseValidators.createSection), courseControllers.addSectionToLesson)
router.post('/enroll/:course', courseControllers.enrollUser )


export default router
