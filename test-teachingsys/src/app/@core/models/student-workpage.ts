import { QUESTION_TYPE } from "../constants"

// request
export class ReqQuestion {
  learningActivityQuestionId: string
  studentAnswers: StudentAnswer[]
  feedback?: string
  studentScore?: number
  date?: Date
}

// response
export class StudentWorkpage {
  task: string
  learningActivity: string
  dueDate: string
  assignmentId: string
  status: string
  internalStatus: string
  isPassed: boolean
  nextAction: string
}

export class StudentAssignment {
  studentName: string
  teacherName: string
  task: string
  taskDescription: string
  learningActivity: string
  learningActivityDescription: string
  class: string
  group: string
  studentScore: number
  assignmentScore: number
  status: string
  assignmentId: string
  internalStatus: string
  questions: StudentAssignmentQuestion[]
  issues: string
  solution: string
  eventEffect: string
  optimization: string
  incentives: string
  isPassed: boolean
  evaluations: StudentAssignmentEvaluation[]
}

export class StudentAssignmentQuestion {
  learningActivityQuestionId: string
  score: number
  needReview: boolean
  interpretations: string[]
  titleEnglish: string
  titleChinese: string
  title: string
  type: QUESTION_TYPE
  studentAnswers: StudentAnswer[]
  questionAnswers: QuestionAnswer[]
  feedback: string
  studentScore: number
  isPassed: boolean
  date: Date
}

export class StudentAssignmentEvaluation {
  type: string
  title: string
  studentScore: number
  teacherScore: number
  fraction: number
}

export class StudentAnswer {
  note: string
  safetyEnv: string
  step: string
  tool: string
  workingHours: number
  interpretation: string
  isAcceptable: boolean
  learningActivityQuestionId: string
  answer: string
}

export class QuestionAnswer {
  id: string
  creationTime: string
  creatorId: string
  lastModificationTime: string
  lastModifierId: string
  isDeleted: boolean
  deleterId: string
  deletionTime: string
  learningActivityQuestionId: string
  answer: string
  answerChinese: string
  answerEnglish: string
  isCorrect: boolean
  languageType: number
  uniqId: string
}
