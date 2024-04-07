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


export const sendMessageAndButton = async (to: number, message: any, bId: string, reply: string): Promise<void> => {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${config.business_id}/messages`,
      headers: {
        Authorization: `Bearer ${config.whatsAppToken}`,
      },
      data: {
       messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
            text: message
        },
          action: {
              buttons: [{ type: "reply",
                    reply: {
                        id: bId.toString,
                        title: reply
                    }
                },
                ]
          }
        }
        
      },
    });
}

export const sendQuiz = async (to: number, message: any, buttons: any): Promise<void> => {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${config.business_id}/messages`,
      headers: {
        Authorization: `Bearer ${config.whatsAppToken}`,
      },
      data: {
       messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
            text: message
        },
          action: {
              buttons: buttons
          }
        }
        
      },
    });
}


const message = async (content: ContentInterface | undefined,to:number, index: number) => {
  if (content && content.type === 'text') {
      await sendMessageAndButton(to, content.content,index.toString(), "next");
    } else if (content && content.type === 'quiz') {
    if (content.options && content.content) {
        const question: string = content.content
        const buttons: any = content.options.map((option, index) => ({ type: 'reply', reply : {id:  index.toString(), title: option} }))
        await sendQuiz(to, question, buttons);

      }
    }
}

const nextMessage = async (index:  number, content: ContentInterface | undefined, to: number) => {
  if (index < contents.length) {
    await message(content,to, index)
  } else {
      await sendMessageAndButton(to, "End of the course.", "finish", "finish"); 
  }
}

export const handleMessage = async (index: number, to: number, userResponse: string) => {
    
  const content: ContentInterface | undefined = contents[index];

  if (userResponse === 'start') {
    await message(content,to,index)
  }

  if (userResponse === 'next') { 
    index++; 
       await nextMessage(index, content,to)
    } else {
        if (content && content.type === 'text') {
          await sendMessageAndButton(to, content.content, index.toString(), "next");
        } else if (content && content.type === 'quiz') {
          const userChoice = parseInt(userResponse);
          console.log(`user choice ${userChoice}`);
            const correctAnswerIndex = content.answerIndex;
          console.log(`correct answer ${correctAnswerIndex}`);

            if (userChoice === correctAnswerIndex) {
              let message = "you got the right answer";
              await sendMessageAndButton(to, message, index.toString(), "next");

            } else {
              let message = `Incorrect!: ${content.answerExplanation}`;
              await sendMessageAndButton(to, message, index.toString(), "next");
            }
          index++; 
          await nextMessage(index, content,to)
      }    
  } 
}

export const sendWelcomeMessage = async (to: number) => {
  const welcomeMessage: string = "Welcome... You've been enrolled to this course...Please click on the button to continue to course"
  await sendMessageAndButton(to, welcomeMessage, "start", "continue" )
}