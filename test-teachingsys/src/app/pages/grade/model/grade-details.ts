export enum QuestionType {
  MultipleChoice = 'MultipleChoice',
  FillIn = 'FillIn',
  Essay = 'Essay',
  WorkPlanTable = 'WorkPlanTable',
  VisualInspectionTable = 'VisualInspectionTable'
}

export class Answer {
  answerChinese: string;
  answerEnglish: string;
  isCorrect: boolean;
}

export class Question {
  score: number;
  learningActivityId: string;
  needReview: boolean;
  titleChinese: string;
  titleEnglish: string;
  type: QuestionType;
  answers: Answer[];
  interpretations: string[];
}

export class StudentAnswer {
  learningActivityQuestionId: string;
  answer: string;
  note: string;
  safetyEnv: string;
  step: string;
  tool: string;
  workingHours: number;
  interpretation: string;
  isAcceptable: boolean;
}

export class QuestionAnswer {
  learningActivityQuestionId: string;
  answer: string;
  answerChinese: string;
  answerEnglish: string;
  isCorrect: true;
  languageType: number;
  uniqId: string;
}

export class QuestionDetail {
  learningActivityQuestionId: string;
  score: number;
  needReview: true;
  interpretations: string[];
  titleEnglish: string;
  titleChinese: string;
  title: string;
  type: string;
  studentAnswers: StudentAnswer[];
  questionAnswers: QuestionAnswer[];
  feedback: string;
  studentScore: number;
}

export class Evaluation {
  type: string;
  title: string;
  studentScore: number;
  teacherScore: number;
  fraction: number;
}

export class GradeItem {
  visualInspection: number;
  visualInspectionSelfScoring: number;
  securityCheck: number;
  functionCheckSelfScoring: number;
}

export class Grade {
  outcome: GradeItem;
  fraction: GradeItem;
  total: number;
}

export class Assessment {
  grade: Grade;
  evaluations: Evaluation[];
}

export class GradeDetail {
  studentName: string;
  task: string;
  taskDescription: string;
  learningActivity: string;
  learningActivityDescription: string;
  class: string;
  group: string;
  studentScore: number;
  assignmentScore: number;
  status: string;
  assignmentId: string;
  internalStatus: string;
  questions: QuestionDetail[];
  issues: string;
  solution: string;
  eventEffect: string;
  optimization: string;
  incentives: string;
  isPassed: boolean;
  evaluations: Evaluation[];
  assessment: Assessment;
}

export class GradeOverview {
  studentName: string;
  task: string;
  learningActivity: string;
  class: string;
  group: string;
  studentScore: number;
  assignmentScore: number;
  isPassed: boolean;
}
