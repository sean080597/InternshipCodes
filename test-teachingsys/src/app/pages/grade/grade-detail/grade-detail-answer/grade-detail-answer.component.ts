import { GradeDetail, QuestionDetail } from './../../model/grade-details';
import { Component, Input, OnInit } from '@angular/core';
import { Question, QuestionType } from '../../model/grade-details';

const MOCK_DATA: Question[] = [
  {
    score: 80,
    learningActivityId: 'learningActivityId 1',
    needReview: true,
    titleChinese: 'titleChinese 1',
    titleEnglish: 'titleEnglish 1',
    type: QuestionType.MultipleChoice,
    answers: [
      {
        answerChinese: 'answerChinese 1',
        answerEnglish: 'answerEnglish 1',
        isCorrect: true
      },
      {
        answerChinese: 'answerChinese 2',
        answerEnglish: 'answerEnglish 2',
        isCorrect: false
      },
      {
        answerChinese: 'answerChinese 3',
        answerEnglish: 'answerEnglish 3',
        isCorrect: true
      }
    ],
    interpretations: [
      'interpretations 1',
      'interpretations 2',
      'interpretations 3'
    ]
  },
  {
    score: 80,
    learningActivityId: 'learningActivityId 2',
    needReview: true,
    titleChinese: 'titleChinese 2',
    titleEnglish: 'titleEnglish 2',
    type: QuestionType.FillIn,
    answers: [
      {
        answerChinese: 'answerChinese 1',
        answerEnglish: 'answerEnglish 1',
        isCorrect: true
      }
    ],
    interpretations: [
      'interpretations 1',
      'interpretations 2',
      'interpretations 3'
    ]
  },
  {
    score: 80,
    learningActivityId: 'learningActivityId 3',
    needReview: true,
    titleChinese: 'titleChinese 3',
    titleEnglish: 'titleEnglish 3',
    type: QuestionType.Essay,
    answers: [
      {
        answerChinese: 'answerChinese 1',
        answerEnglish: 'answerEnglish 1',
        isCorrect: true
      },
      {
        answerChinese: 'answerChinese 2',
        answerEnglish: 'answerEnglish 2',
        isCorrect: false
      },
      {
        answerChinese: 'answerChinese 3',
        answerEnglish: 'answerEnglish 3',
        isCorrect: true
      }
    ],
    interpretations: [
      'interpretations 1',
      'interpretations 2',
      'interpretations 3'
    ]
  },
  {
    score: 80,
    learningActivityId: 'learningActivityId 4',
    needReview: true,
    titleChinese: 'titleChinese 4',
    titleEnglish: 'titleEnglish 4',
    type: QuestionType.WorkPlanTable,
    answers: [
      {
        answerChinese: 'answerChinese 1',
        answerEnglish: 'answerEnglish 1',
        isCorrect: true
      },
      {
        answerChinese: 'answerChinese 2',
        answerEnglish: 'answerEnglish 2',
        isCorrect: false
      },
      {
        answerChinese: 'answerChinese 3',
        answerEnglish: 'answerEnglish 3',
        isCorrect: true
      }
    ],
    interpretations: [
      'interpretations 1',
      'interpretations 2',
      'interpretations 3'
    ]
  },
  {
    score: 80,
    learningActivityId: 'learningActivityId 5',
    needReview: true,
    titleChinese: 'titleChinese 5',
    titleEnglish: 'titleEnglish 5',
    type: QuestionType.VisualInspectionTable,
    answers: [
      {
        answerChinese: 'answerChinese 1',
        answerEnglish: 'answerEnglish 1',
        isCorrect: true
      },
      {
        answerChinese: 'answerChinese 2',
        answerEnglish: 'answerEnglish 2',
        isCorrect: false
      },
      {
        answerChinese: 'answerChinese 3',
        answerEnglish: 'answerEnglish 3',
        isCorrect: true
      }
    ],
    interpretations: [
      'interpretations 1',
      'interpretations 2',
      'interpretations 3'
    ]
  }
];

@Component({
  selector: 'app-grade-detail-answer',
  templateUrl: './grade-detail-answer.component.html',
  styleUrls: ['./grade-detail-answer.component.scss']
})
export class GradeDetailAnswerComponent implements OnInit {
  @Input() gradeDetail: GradeDetail = new GradeDetail();

  constructor() { }

  ngOnInit(): void {
    console.log(this.questions)
  }

  public get questions(): QuestionDetail[] {
    return this.gradeDetail.questions;
  }
}
