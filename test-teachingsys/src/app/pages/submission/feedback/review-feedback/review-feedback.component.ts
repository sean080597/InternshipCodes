import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '@app/@core/services/common.service';
import { FeedbackService } from '@app/@core/services/feedback.service';

@Component({
  selector: 'app-review-feedback',
  templateUrl: './review-feedback.component.html',
  styleUrls: ['./review-feedback.component.scss']
})
export class ReviewFeedbackComponent implements OnInit { 
  feedbackData: any
  assignmentId='';
  workplanData:any;
  constructor(private feedbackService: FeedbackService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private router: Router) {
      this.assignmentId = this.route.snapshot.paramMap.get('id');
    }

  backToList() {
    this.router.navigate(['submission/feedback/'])
  }

  ngOnInit(): void {
    this.workplanData = Array(24).fill(0).map((x, i) => {
      return {
        order: i + 1
      }
    });
    this.feedbackService.getAssignmentById(this.assignmentId).subscribe (res => {
      this.feedbackData = res.data;
      let qAnswers = [], sAnswers = [];
      for (let q in res.data.questions) {
        if (res.data.questions[q].type === 'FillIn') {
          for (let qa of res.data.questions[q].questionAnswers) {
            qAnswers.push({ ...qa, answer: qa.answer.split(",") })
          };
          for (let qa of res.data.questions[q].studentAnswers) {
            sAnswers.push({ ...qa, answer: qa.answer.split(",") })
          }
          res.data.questions[q] = { ...res.data.questions[q], questionAnswers: qAnswers, studentAnswers: sAnswers, feedback: '', isValid: false, isDirty: false }
        }
        else {
          if (res.data.questions[q].type !== 'MultipleChoice') {
            res.data.questions[q] = { ...res.data.questions[q], isValid: false, isDirty: false }
          }
          else res.data.questions[q] = { ...res.data.questions[q], isValid: true, isDirty: true }

        }
      }
      this.feedbackData = { ...res.data, isPassed: true };
      if (res.data.studentScore === res.data.assignmentScore) {
      }
      console.log(this.feedbackData)
    })
  }

}