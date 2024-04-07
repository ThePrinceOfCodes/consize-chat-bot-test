import axios from "axios";
import config from '../../config/config'
import { ContentInterface } from "./interfaces.whatsapp";

export const contents: ContentInterface[] = [
    { type: 'text', content: 'Welcome to the WhatsApp chat bot course!' },
    { type: 'quiz', question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'], answerIndex: 1 },
  { type: 'text', content: 'Congratulations! You have completed the course.' },
       { type: 'quiz', question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'], answerIndex: 1 },
      { type: 'text', content: 'Congratulations! You have completed the course.' }
   
];

export const sendWhatsAppMessage = async(to:string, message: any, business_phone_number_id:string):Promise<void>=>{
  await axios({
    method: "POST",
    url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
    headers: {
      Authorization: `Bearer ${config.whatsAppToken}`,
    },
    data: {
      messaging_product: "whatsapp",
      to: to,
      template: message,
    },
  });
}

export const sendNextButton = async (to:string,  business_phone_number_id:string, title: string, payload: string) => {
  const button = [{ type: 'reply', title: title, payload: payload }];
  await sendWhatsAppMessage(to, button, business_phone_number_id)
}

const message = async (content: ContentInterface | undefined,to:string, business_id: string) => {
  if (content && content.type === 'text') {
      await sendWhatsAppMessage(to, content.content, business_id);
      await sendNextButton(to, business_id,"Next", "next");
    } else if (content && content.type === 'quiz') {
      if (content.options) {
        const question = {
          text: content.question,
          buttons: content.options.map((option, index) => ({ type: 'reply', title: option, payload: index.toString() }))
        }
        await sendWhatsAppMessage(to, question, business_id);

      }
    }
}

const nextMessage = async (index:  number, content: ContentInterface | undefined, to: string, business_id: string) => {
  if (index < contents.length) {
    await message(content,to,business_id)
  } else {
      await sendWhatsAppMessage(to, "End of the course.", business_id); 
  }
}

const sendMessageAndNextButton = async (to: string, message: string |  undefined, business_id: string) => {
  await sendWhatsAppMessage(to, message, business_id);
  await sendNextButton(to, business_id,"Next", "next");
}

export const handleMessage = async (index: any, to: string, business_id: string, userResponse: string) => {
    
  const content: ContentInterface | undefined = contents[index];

  if (userResponse === 'start') {
    await message(content,to,business_id)
  }

  if (userResponse === 'next') { 
        index++; 
       await nextMessage(index, content,to,business_id)
    } else {
        if (content && content.type === 'text') {
            await sendMessageAndNextButton(to, content.content, business_id);
        } else if (content && content.type === 'quiz') {
            const userChoice = parseInt(userResponse); 
            const correctAnswerIndex = content.answerIndex;

            if (userChoice === correctAnswerIndex) {
              let message = "you got the right answer";
              await sendMessageAndNextButton(to, message, business_id);

            } else {
              let message = `Incorrect!: ${content.answerExplanation}`;
              await sendMessageAndNextButton(to, message, business_id);;
            }
          index++; 
          await nextMessage(index, content,to,business_id)
      }    
  } 
}

export const sendWelcomeMessage = async (to: string, business_id: string) => {
  const welcomeMessage: string = "Welcome... You've been enrolled to this course.../n please click on the button to continue to course"
  await sendWhatsAppMessage(to, welcomeMessage, business_id)
  await sendNextButton(to,business_id,"Continue", "start")
}