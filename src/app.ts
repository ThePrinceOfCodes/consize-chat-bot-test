import express, { Express } from 'express'
import helmet from 'helmet'
import xss from 'xss-clean'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import cors from 'cors'
import httpStatus from 'http-status'
import config from './config/config'
import { morgan } from './modules/logger'
import { authLimiter } from './modules/utils'
import { ApiError, errorConverter, errorHandler } from './modules/errors'
import routes from './routes/v1'


const app: Express = express()

if (config.env !== 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}

// set security HTTP headers
app.use(helmet())

// enable cors
app.use(cors())
app.options('*', cors())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// sanitize request data
app.use(xss())
app.use(ExpressMongoSanitize())

// gzip compression
app.use(compression())



// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter)
}

// v1 api routes
app.use('/v1', routes)

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)

app.get("/webhook", (req, res) => {
  res.status(200).send
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === "concise") {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

export default app
