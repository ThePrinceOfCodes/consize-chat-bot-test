import express, { Request, Response, Router } from 'express'
import authRoute from './auth.route'
import coursesRoute from './courses.route'
import lessonsRoute from './lessons.route'
import sectionsRoute from './sections.route'
import quizzesRoute from './quizzes.route'
import webhookRoute from './webhook.route'
import config from '../../config/config'

const router = express.Router()

interface IRoute {
  path: string
  route: Router
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/courses',
    route: coursesRoute
  },
  {
    path: '/lessons',
    route: lessonsRoute
  },
  {
    path: '/sections',
    route: sectionsRoute
  },
  {
    path: '/quiz',
    route: quizzesRoute
  },
   {
    path: '/webhook',
    route: webhookRoute
  }
]

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
]
router.get('/', (_: Request, res: Response): void => {
  res.send(`... technical test`)
})
defaultIRoute.forEach((route) => {
  router.use(route.path, route.route)
})
/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route)
  })
}

export default router
