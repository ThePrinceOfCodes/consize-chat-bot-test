import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import * as whatsappService from './service.whatsapp'
import httpStatus from 'http-status'
import { Enrollment } from '../courses'
// import axios from 'axios'
// import config from '../../config/config'

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
  
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message) {
    if (message?.type === "interactive") {
      const customerNumber = message.from

      const userResponse = message.interactive.button_reply.title;
      let userCurrentIndex;
      let enrollment = await Enrollment.findOne({userMobile: customerNumber});

      console.log(enrollment + "   enrolment");

      if (userResponse === 'start') {
        userCurrentIndex = 0
      } else
      if (userResponse === 'next') {
        userCurrentIndex = parseInt(message.interactive.button_reply.id)
      } else
      {
        userCurrentIndex = message.interactive.button_reply.id
      }

      if (enrollment) {
        await whatsappService.handleMessage(userCurrentIndex, customerNumber, userResponse, enrollment.course) 
      } else {
        await whatsappService.sendMessage(customerNumber, "you are not enrolled in this course")
        
      }


    } else {
      const customerNumber = message.from
      await whatsappService.sendMessage(customerNumber, "please text message are not allowed, Kindly interact by using the buttons provided" )
    }
  }

  res.sendStatus(200);

})

export const sendCourseInvitation = catchAsync(async (_: Request, res: Response) => {
  
  await whatsappService.sendWelcomeMessage(2348138505718)

  res.status(httpStatus.OK).send('invite sent successfully')
})