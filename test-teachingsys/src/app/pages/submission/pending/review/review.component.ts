import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/@core/services/common.service';
import { PendingService } from '@app/@core/services/pending.service';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  assignmentId: string;
  assignmentData: any = {};
  workplanData: any = []
  isVisible: boolean = false;
  modal = {
      title : this.translate.instant('confirm-send-result-title'),
      content: this.translate.instant('confirm-send-result-content')
  }
  requestAssignmentData: any;
  totalScore: any;
  canSubmit: boolean = false;

  constructor( private pendingService: PendingService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private translate: TranslateService,
    private msg: NzMessageService
    ) {
      this.assignmentId = this.route.snapshot.paramMap.get('id');      
     }

  showModal(): void {
    if (this.assignmentData.questions.find(e => (e.isValid === false && e.isDirty === true))) {
      this.canSubmit = false; 
      this.assignmentData.questions =this.assignmentData.questions.map(e => {
        const isDirty = !e.isDirty && e.type !== 'MultipleChoice';
        return {...e, isDirty: isDirty}
      });
      this.msg.error(this.translate.instant('answers-did-not-be-set'))
    }
    else {
      this.convertToRequestQuestion(this.assignmentData)
      this.isVisible = true;
    }
  }

  handleOk(): void {
    this.pendingService.sendAssignmentResult(this.requestAssignmentData).subscribe(res => console.log(res))
    this.isVisible = false;     
  }

  convertToRequestQuestion(data) {
    this.requestAssignmentData = {
      assignmentId: this.assignmentId,
      questions: data.questions.map(q => {
        return {
            learningActivityQuestionId : q.learningActivityQuestionId,
            feedback: q.feedback,
            studentScore: q.studentScore
        }
      })
    }
  }

  validateScore(event, questionScore, index) {
    this.assignmentData.studentScore = 0
    for (let question of this.assignmentData.questions) {
      this.assignmentData.studentScore += question.studentScore
    }
    if ((event.target.value > questionScore) || (event.target.value === '') || (event.target.value === null) ) {
      this.assignmentData.questions[index].isValid = false
    }
    else {
      this.assignmentData.questions[index].isValid = true
    }
    if (!this.assignmentData.questions.find(e => (e.isValid === false))) {
      this.canSubmit = true
    }
    else {
      this.canSubmit = false
    }

    console.log(this.assignmentData.questions, this.assignmentData.questions[index].isValid)
  }

  onDirty(index) {
    this.assignmentData.questions[index].isDirty = true
  }

  handleCancel(): void {
      this.isVisible = false;
  }

  ngOnInit(): void {
    this.workplanData = Array(24).fill(0).map((x,i)=>{
      return {
        order: i + 1
      }
    }); 
    this.pendingService.getAssignmentById(this.assignmentId).subscribe(res => {
      let qAnswers = [], sAnswers = [];
      for (let q in res.data.questions) {
        if (res.data.questions[q].type === 'FillIn') {
          for (let qa of res.data.questions[q].questionAnswers) {
            qAnswers.push({...qa, answer: qa.answer.split(",")})
          };
          for (let qa of res.data.questions[q].studentAnswers) {
            sAnswers.push({...qa, answer: qa.answer.split(",")})
          }
          res.data.questions[q] = {...res.data.questions[q], questionAnswers: qAnswers, studentAnswers: sAnswers, feedback: '', isValid: false, isDirty: false}
        }
        else {
          if (res.data.questions[q].type !== 'MultipleChoice') {
            res.data.questions[q] = {...res.data.questions[q], isValid: false, isDirty: false}
          }
          else res.data.questions[q] = {...res.data.questions[q], isValid: true, isDirty: true}
             
        }
      }
      this.assignmentData = {...res.data, isPassed: true};
      if (res.data.studentScore === res.data.assignmentScore) {
        this.canSubmit = true
      }
      else this.canSubmit = false
    })
  }

}
