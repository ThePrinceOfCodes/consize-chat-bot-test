import express, { Router } from 'express'
import { validate } from '../../modules/validate'
import { auth } from '../../modules/auth'
import { courseControllers, courseValidators } from "../../modules/courses"

const router: Router = express.Router()
router.use(auth())

router.post('/:course/:lesson', validate(courseValidators.createBlock), courseControllers.addBlockToLesson)
router.post('/quiz/:course/:lesson/:block', validate(courseValidators.createQuiz), courseControllers.addQuizToBlock)

export default router
