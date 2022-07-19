import { STUDENT_STT } from "@app/@core/constants";

export class TestReport {
  taskUniqId: string;
  taskName: string;
  learningActivityReports: ActivityReport[]
}

export class ActivityReport {
  learningActivityUniqId: string;
  learningActivityTitle: string
  learningActivityDescription: string;
  dueDate: string;
  numberOfSubmission: number
  totalSubmission: number
}

export class ActivityDetailsReport {
  taskUniqId: string;
  taskName: string;
  taskDescription: string;
  learningActivityUniqId: string;
  learningActivityTitle: string
  learningActivityDescription: string;
  classReports: ClassReport[]
}

export class ClassReport {
  classUniqId: string
  className: string
}

export class ClassReportDetails {
  classUniqId: string
  className: string
  questionReports: QuestionReport[]
  statusReports: StatusReport[]
  studentReports: StudentReport[]
}

export class QuestionReport {
  questionUniqId: string
  questionTitle: string
  numberOfCorrect: number
  numberOfWrong: number
  numberOfNoAnswerYet: number
  questionAnswerReports: QuestionAnswerReport[]
}

export class QuestionAnswerReport {
  questionAnwserUniqId: string
  answer: string
  isCorrect: boolean
  numberOfAnswer: number
}

export class StatusReport {
  statusName: STUDENT_STT
  numberOfStatus: number
}

export class StudentReport {
  studentId: string
  studentNameChi: string
  studentNameEng: string
  statusName: STUDENT_STT
}
