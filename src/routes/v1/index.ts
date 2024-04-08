import express, { Request, Response, Router } from 'express'
import coursesRoute from './courses.route'
import webhookRoute from './webhook.route'
import config from '../../config/config'

const router = express.Router()

interface IRoute {
  path: string
  route: Router
}

const defaultIRoute: IRoute[] = [
  {
    path: '/courses',
    route: coursesRoute
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
