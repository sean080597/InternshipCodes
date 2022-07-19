export interface QuestionBanks {
    learningActivityUniqueId: string | undefined;
    learingActivityQuestions: QuestionBank[];
    totalScore: number | 0;
}

export interface QuestionBank {
    learningActivityUniqueId: string | undefined;
    score: number | 0;
    needReview: boolean | false;
    titleEnglish: string | undefined;
    titleChinese: string | undefined;
    type: string | undefined;
    learingActivityQuestionAnswers: Answer[];
}

export interface Answer {
    answerEnglish: string | undefined;
    answerChinese: string | undefined;
    isCorrect: boolean | false;
}

export interface LearningActivityDetail {
   title: string;
   titleChi: string;
   titleEng: string;
   description: string;
   descriptionChi: string;
   descriptionEng: string;
   taskUniqueId: string;
   learningActivityRefId: string;
   questions: QuestionBank[];
}
