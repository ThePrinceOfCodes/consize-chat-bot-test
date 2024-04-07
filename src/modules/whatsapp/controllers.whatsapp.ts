import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import * as whatsappService from './service.whatsapp'
import httpStatus from 'http-status'
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
  const customerNumber = message.from

  if (message?.type === "interactive") {
  
    const userResponse = message.text.body.trim().toUpperCase();

    let userCurrentIndex = 0;

    await whatsappService.handleMessage(userCurrentIndex, customerNumber, userResponse) 

  } else {
    await whatsappService.sendMessageAndButton(customerNumber, "please text message are not allowed, Kindly interact by using the buttons provided", "Next", "next")
  }

  res.sendStatus(200);

})

export const sendCourseInvitation = catchAsync(async (_: Request, res: Response) => {
  
  await whatsappService.sendWelcomeMessage(2348138505718)

  res.status(httpStatus.OK).send('invite sent successfully')
})