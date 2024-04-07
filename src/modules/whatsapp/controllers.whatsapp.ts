import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import * as whatsappService from './service.whatsapp'
import httpStatus from 'http-status'

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

  if (message?.type === "text") {
  
    // const business_phone_number_id = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
    const customerNumber = message.from

    const userResponse = message.text.body.trim().toUpperCase();

    let userCurrentIndex = 0;

    await whatsappService.handleMessage(userCurrentIndex, customerNumber, userResponse) 

  }
  res.sendStatus(200);

})

export const sendCourseInvitation = catchAsync(async (_: Request, res: Response) => {
  const clients: string[] = ['2348138505718'] 

  clients.forEach( async (client) => {
    await whatsappService.sendWelcomeMessage(client)
  })

  res.status(httpStatus.OK).send('invite sent successfully')
})