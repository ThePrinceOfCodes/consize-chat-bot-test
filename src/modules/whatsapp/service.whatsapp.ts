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

export const sendWhatsAppMessage = async(to:string, message: any):Promise<void>=>{
  await axios({
    method: "POST",
    url: `https://graph.facebook.com/v18.0/${config.business_id}/messages`,
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

export const sendNextButton = async (to:string, title: string, payload: string) => {
  const button = [{ type: 'reply', title: title, payload: payload }];
  await sendWhatsAppMessage(to, button)
}

const message = async (content: ContentInterface | undefined,to:string) => {
  if (content && content.type === 'text') {
      await sendWhatsAppMessage(to, content.content);
      await sendNextButton(to, "Next", "next");
    } else if (content && content.type === 'quiz') {
      if (content.options) {
        const question = {
          text: content.question,
          buttons: content.options.map((option, index) => ({ type: 'reply', title: option, payload: index.toString() }))
        }
        await sendWhatsAppMessage(to, question);

      }
    }
}

const nextMessage = async (index:  number, content: ContentInterface | undefined, to: string) => {
  if (index < contents.length) {
    await message(content,to)
  } else {
      await sendWhatsAppMessage(to, "End of the course."); 
  }
}

const sendMessageAndNextButton = async (to: string, message: string |  undefined) => {
  await sendWhatsAppMessage(to, message);
  await sendNextButton(to, "Next", "next");
}

export const handleMessage = async (index: any, to: string, userResponse: string) => {
    
  const content: ContentInterface | undefined = contents[index];

  if (userResponse === 'start') {
    await message(content,to)
  }

  if (userResponse === 'next') { 
        index++; 
       await nextMessage(index, content,to)
    } else {
        if (content && content.type === 'text') {
            await sendMessageAndNextButton(to, content.content);
        } else if (content && content.type === 'quiz') {
            const userChoice = parseInt(userResponse); 
            const correctAnswerIndex = content.answerIndex;

            if (userChoice === correctAnswerIndex) {
              let message = "you got the right answer";
              await sendMessageAndNextButton(to, message);

            } else {
              let message = `Incorrect!: ${content.answerExplanation}`;
              await sendMessageAndNextButton(to, message);;
            }
          index++; 
          await nextMessage(index, content,to)
      }    
  } 
}

export const sendWelcomeMessage = async (to: string) => {
  const welcomeMessage: string = "Welcome... You've been enrolled to this course.../n please click on the button to continue to course"
  await sendWhatsAppMessage(to, welcomeMessage)
  await sendNextButton(to, "Continue", "start")
}