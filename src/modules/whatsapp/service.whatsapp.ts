import axios from "axios";
import config from '../../config/config'
import { ContentInterface } from "./interfaces.whatsapp";
import { courseService } from "../courses";
import { redisClient } from '../courses/redis'



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

export const sendMessage = async (to: number, message: string,): Promise<void> => {
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
      type: "text",
      text: {
        preview_url: false,
        body: message
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

export const  message = async (content: ContentInterface | undefined, to: number, index: number) => {
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

const nextMessage = async (index:  number, content: ContentInterface | undefined, to: number, contents: ContentInterface[] ) => {
  if (index <= contents.length) {
    await message(content,to, index)
  } else {
      await sendMessage(to, "Congratulations, course completed successfully."); 
  }
}

export const handleMessage = async (index: any, to: number, userResponse: string, course: string) => {
  
  //get from redis
  let contents: ContentInterface[] | undefined = await courseService.getCourseFlow(course)

  if (contents) {
    console.log(contents[index]);
    if (userResponse === 'start') {
      await message(contents[index], to, 1)
      await redisClient.set(`index`, JSON.stringify(index));

  }
  else
  if (userResponse === 'next') {  
       await nextMessage(index+1, contents[index],to, contents)
  } else {
    
    const data = index.split(" ")
    
    const OptionsIndex: number = parseInt(data[0]) - 1
    const nextIndex: number = OptionsIndex+1
    
    const userChoice = data[1]
    const quizContent = contents[OptionsIndex]
    
    if (quizContent) {
    if (userChoice === quizContent.correctAnswer) {
        let message = "you got the right answer";
        await sendMessageAndButton(to, message, nextIndex.toString(), "next");
    } else {
        let message = `Incorrect!: ${quizContent.answerExplanation}`;
        await sendMessageAndButton(to, message, nextIndex.toString(), "next");
    }
      
    await nextMessage(OptionsIndex+1, contents[index], to, contents);
 }
  }
  }
 
 
}
     
export const sendWelcomeMessage = async (to: number) => {
  const welcomeMessage: string = "Welcome... You've been enrolled to this course...Please click on the button to continue to course"
  await sendMessageAndButton(to, welcomeMessage, "0", "start" )
}