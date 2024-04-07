import axios from "axios";
import config from '../../config/config'
import { ContentInterface } from "./interfaces.whatsapp";

export const contents: ContentInterface[] = [
    { type: 'text', content: 'Welcome to the WhatsApp chat bot course!' },
    { type: 'text', content: 'Welcome to the WhatsApp chat bot course!' },
    { type: 'text', content: 'Welcome to the WhatsApp chat bot course!' },
  { type: 'quiz', question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin'], answerIndex: 'A' },
        { type: 'quiz', question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin'], answerIndex: 'A'},
            { type: 'quiz', question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin'], answerIndex: 'A'},
  { type: 'text', content: 'Congratulations! You have completed the course.' },
       { type: 'quiz', question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin'], answerIndex: 'C' },
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
                        id: bId,
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
            buttons: [
              {
                type: "reply",
                    reply: {
                        id: "A",
                        title: buttons[0]
                    }
              },
              {
                type: "reply",
                    reply: {
                        id: "B",
                        title: buttons[1]
                    }
              },
              {
                type: "reply",
                    reply: {
                        id: "C",
                        title: buttons[2]
                    }
                },
                ]
          }
        }
        
      },
    });
}


const message = async (content: ContentInterface | undefined, to: number, index: number) => {
  if (content) {
    if (content.type === 'text') {
      await sendMessageAndButton(to, content.content,index.toString(), "next");
    }

    if (content.type === 'quiz') {
    if (content.options && content.question) {
      const question: string = content.question
      // const buttons: any = content.options.map((option, index) => ({ type: 'reply', reply : {id:  index.toString(), title: option} }))
      await sendQuiz(to, question, content.options);

      }
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
    await message(content,to,0)
  }

  if (userResponse === 'next') {  
       await nextMessage(index+1, content,to)
  } 
  
  if (userResponse in ["A", "B", "C"]) {
    console.log('qwertyuiop');
    if (content) {
      console.log(123344556778);
    const userChoice = userResponse;

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
    await nextMessage(index, content, to);
    }
 }
 
  console.log("no conditions met");
 
}
     

export const sendWelcomeMessage = async (to: number) => {
  const welcomeMessage: string = "Welcome... You've been enrolled to this course...Please click on the button to continue to course"
  await sendMessageAndButton(to, welcomeMessage, "start", "continue" )
}