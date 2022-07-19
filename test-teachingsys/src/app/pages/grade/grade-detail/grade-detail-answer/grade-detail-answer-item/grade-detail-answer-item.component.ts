import { QuestionDetail, QuestionAnswer } from './../../../model/grade-details';
import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '@app/@core/services/common.service';
import { Question, QuestionType } from '@app/pages/grade/model/grade-details';

@Component({
  selector: 'app-grade-detail-answer-item',
  templateUrl: './grade-detail-answer-item.component.html',
  styleUrls: ['./grade-detail-answer-item.component.scss']
})
export class GradeDetailAnswerItemComponent implements OnInit {
  @Input() question: QuestionDetail = new QuestionDetail();
  @Input() index: number = 0;

  constructor(
    public commonService: CommonService
  ) { }

  ngOnInit(): void {
  }

  public get workplanData(): { order: number }[] {
    return Array(24).fill(0).map((x, i)=>{
      return {
        order: i + 1
      }
    });
  }

  public get questionType(): { [key: string]: string } {
    return QuestionType;
  }

  public isMultipleChoiceAnswerValid(questionAnswers: QuestionAnswer[]): { engValid: boolean, zhValid: boolean } {
    return {
      engValid: questionAnswers.every(item => item.answerEnglish),
      zhValid: questionAnswers.every(item => item.answerChinese)
    }
  }

  public getMultipleChoicesStudentAnswer(question: QuestionDetail): string {
    let answer = '';
    question.questionAnswers.forEach(
      (item, index) => {
        if (question.studentAnswers[index].answer === 'true') {
          answer += (answer === '') ? item.answer : `, ${item.answer}`;
        }
      }
    );
    return answer;
  }

  public splitFillInAnswerItem(answer: string): string[] {
    return answer.split(', ');
  }
}
