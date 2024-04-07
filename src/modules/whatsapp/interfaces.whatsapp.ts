
export interface ContentInterface {
    type: string;
    content?: string;
    question?: string;
    options?: string[];
    answerIndex?: number;
    answerExplanation?:string
}