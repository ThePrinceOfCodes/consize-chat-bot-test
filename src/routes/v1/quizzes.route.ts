import express, { Router } from 'express'
import { auth } from '../../modules/auth'


const router: Router = express.Router()
router.use(auth())

export default router
