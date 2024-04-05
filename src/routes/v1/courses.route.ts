import express, { Router } from 'express'
import { validate } from '../../modules/validate'
import { courseControllers, courseValidators } from "../../modules/courses"

const router: Router = express.Router()
router.post('/', validate(courseValidators.createCourse), courseControllers.createCourseManually)

export default router
