import axios from "axios";
import config from '../../config/config'
import { ContentInterface } from "./interfaces.whatsapp";

export const contents: ContentInterface[] = [
    
    { type: 'text', content: 'Welcome to the WhatsApp chat bot course!' },
  { type: 'quiz', question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin'], correctAnswer: 'Paris' , answerExplanation: "cahdhdsjshd" },
        { type: 'quiz', question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin'], correctAnswer: 'Paris' , answerExplanation: "cahdhdsjshd"},
            { type: 'quiz', question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin'], correctAnswer: 'Paris' , answerExplanation: "cahdhdsjshd"},
  { type: 'text', content: 'Congratulations! You have completed the course.' },
       { type: 'quiz', question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin'], correctAnswer: 'Paris' , answerExplanation: "cahdhdsjshd"},
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

export const sendQuiz = async (to: number, message: any, buttons: any , index: string): Promise<void> => {
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
                        id: index + " "+buttons[0]+" A",
                        title: buttons[0]
                    }
              },
              {
                type: "reply",
                    reply: {
                        id: index + " "+buttons[1]+" B",
                        title: buttons[1]
                    }
              },
              {
                type: "reply",
                    reply: {
                        id: index + " " + buttons[2]+" C",
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
      await sendMessageAndButton(to, content.content, index.toString(), "next");
    }

    if (content.type === 'quiz') {
    if (content.options && content.question) {
      const question: string = content.question
      // const buttons: any = content.options.map((option, index) => ({ type: 'reply', reply : {id:  index.toString(), title: option} }))
      await sendQuiz(to, question, content.options, index.toString());

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
  else
  if (userResponse === 'next') {  
       await nextMessage(index+1, content,to)
  } else {
    
    const data = userResponse.split(" ")
    
    console.log(userResponse);
    
    //@ts-ignore
    const OptionsIndex:number = parseInt(data[0])
    const userChoice = data[1]


    //@ts-ignore
    const quizContent = contents[OptionsIndex]

    if (quizContent) {
    console.log(123344556778);

    console.log(`user choice ${userChoice}`);

    const correctAnswerIndex = quizContent.correctAnswer;

    console.log(`correct answer ${correctAnswerIndex}`);

    if (userChoice === correctAnswerIndex) {
        let message = "you got the right answer";
        await sendMessageAndButton(to, message, index.toString(), "next");
    } else {
        let message = `Incorrect!: ${quizContent.answerExplanation}`;
        await sendMessageAndButton(to, message, index.toString(), "next");
    }
      
    await nextMessage(OptionsIndex+1, content, to);
 }
  }
 
}
     

export const sendWelcomeMessage = async (to: number) => {
  const welcomeMessage: string = "Welcome... You've been enrolled to this course...Please click on the button to continue to course"
  await sendMessageAndButton(to, welcomeMessage, "start", "continue" )
}