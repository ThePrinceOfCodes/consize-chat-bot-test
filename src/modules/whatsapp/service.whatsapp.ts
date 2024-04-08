import axios from "axios";
import config from '../../config/config'
import { ContentInterface } from "./interfaces.whatsapp";

export const contents: ContentInterface[] = [

  { type: "text", content: "Lesson 1: Introduction to HTML" },
  { type: "text", content: "In this lesson, you'll learn the basics of HTML." },
  { 
    type: "quiz",
    question: "What does HTML stand for?",
    options: ["Hypertext Markup Language", "Hyperlink and Text Markup Language", "Highly Textured Markup Language"],
    correctAnswer: "Hypertext Markup Language",
    answerExplanation: "HTML stands for Hypertext Markup Language."
  },
  { type: "text", content: "Lesson 2: HTML Basics" },
  { type: "text", content: "In this lesson, you'll learn about the basic structure of HTML documents." },
  { 
    type: "quiz",
    question: "Which tag is used to define the document type in HTML5?",
    options: ["<!DOCTYPE html>", "<html>", "<meta>"],
    correctAnswer: "<!DOCTYPE html>",
    answerExplanation: "The correct tag to define the document type in HTML5 is <!DOCTYPE html>."
  },
  { type: "text", content: "Lesson 3: HTML Elements" },
  { type: "text", content: "In this lesson, you'll learn about HTML elements and how to use them to structure your web pages." },
  { 
    type: "quiz",
    question: "Which tag is used to create a paragraph in HTML?",
    options: ["<p>", "<para>", "<paragraph>"],
    correctAnswer: "<p>",
    answerExplanation: "The <p> tag is used to create a paragraph in HTML."
  },
  { type: "text", content: "Lesson 4: HTML Attributes" },
  { type: "text", content: "In this lesson, you'll learn about HTML attributes and how to use them to provide additional information about elements." },
  { 
    type: "quiz",
    question: "Which attribute is used to specify the URL of an anchor link in HTML?",
    options: ["href", "src", "link"],
    correctAnswer: "href",
    answerExplanation: "The href attribute is used to specify the URL of an anchor link in HTML."
  },
  { type: "text", content: "Lesson 5: HTML Formatting" },
  { type: "text", content: "In this lesson, you'll learn about HTML formatting elements such as bold, italic, and underline." },
  { 
    type: "quiz",
    question: "Which tag is used to make text bold in HTML?",
    options: ["<b>", "<bold>", "<strong>"],
    correctAnswer: "<strong>",
    answerExplanation: "The <strong> tag is used to make text bold in HTML."
  },
  { type: "text", content: "Lesson 6: HTML Links" },
  { type: "text", content: "In this lesson, you'll learn how to create hyperlinks in HTML to link to other web pages." },
  { 
    type: "quiz",
    question: "What is the correct HTML for creating a hyperlink?",
    options: ["<a href='http://example.com'>Example</a>", "<link href='http://example.com'>Example</link>", "<href='http://example.com'>Example</>"],
    correctAnswer: "<a href='http://example.com'>Example</a>",
    answerExplanation: "The correct HTML for creating a hyperlink is <a href='http://example.com'>Example</a>."
  },
  { type: "text", content: "Lesson 7: HTML Images" },
  { type: "text", content: "In this lesson, you'll learn how to add images to your HTML pages." },
  { 
    type: "quiz",
    question: "Which tag is used to display an image in HTML?",
    options: ["<img>", "<image>", "<picture>"],
    correctAnswer: "<img>",
    answerExplanation: "The <img> tag is used to display an image in HTML."
  },
  { type: "text", content: "Lesson 8: HTML Lists" },
  { type: "text", content: "In this lesson, you'll learn how to create ordered and unordered lists in HTML." },
  { 
    type: "quiz",
    question: "Which tag is used to create an unordered list in HTML?",
    options: ["<ul>", "<ol>", "<li>"],
    correctAnswer: "<ul>",
    answerExplanation: "The <ul> tag is used to create an unordered list in HTML."
  },
  { type: "text", content: "Lesson 9: HTML Tables" },
  { type: "text", content: "In this lesson, you'll learn how to create tables in HTML to display tabular data." },
  { 
    type: "quiz",
    question: "What does the HTML <table> element represent?",
    options: ["A table of data", "A section of text", "An image"],
    correctAnswer: "A table of data",
    answerExplanation: "The HTML <table> element represents a table of data."
  },
  { type: "text", content: "Lesson 10: HTML Forms" },
  { type: "text", content: "In this lesson, you'll learn how to create forms in HTML to collect user input." },
  { 
    type: "quiz",
    question: "Which attribute is used to specify the URL of the image to be displayed in HTML?",
    options: ["src", "url", "link"],
    correctAnswer: "src",
    answerExplanation: "The src attribute is used to specify the URL of the image to be displayed in HTML."
  }
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

export const handleMessage = async (index: any, to: number, userResponse: string) => {
    
  const content: ContentInterface | undefined = contents[index];

  if (userResponse === 'start') {
    await message(content,to,0)
  }
  else
  if (userResponse === 'next') {  
       await nextMessage(index+1, content,to)
  } else {
    
    const data = index.split(" ")
    
    const OptionsIndex:number = parseInt(data[0])
    const userChoice = data[1]

    const quizContent = contents[OptionsIndex]

    if (quizContent) {
    
    if (userChoice === quizContent.correctAnswer) {
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
  await sendMessageAndButton(to, welcomeMessage, "0", "start" )
}