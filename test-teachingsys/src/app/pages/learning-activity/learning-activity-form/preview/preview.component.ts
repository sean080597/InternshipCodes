import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INTERPRETATION, NULL_UUID } from '@app/@core/constants';
import { LearningActivityDetail } from '@app/@core/models/question-bank';
import { CommonService } from '@app/@core/services/common.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import { LearningActivityService } from 'src/app/@core/services/learning-activity.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
  @Input() learningActivitySubmittedData: any = {};
  @Input() learningActivityId: any = '';
  learningActivity: any = {};
  currentLang: string = 'en';
  previewData: any = {};
  nullUuid = NULL_UUID;
  workplanData: any = [];
  visualInspectionData: any = [];
  imageAllowedExt = ['jpg', 'png', 'jpeg'];
  interpretation = INTERPRETATION;
  currentTask: any = {};
    constructor(
      private route: ActivatedRoute,
      private learningActivityService: LearningActivityService,
      public commonService: CommonService
    ) {
      this.currentLang = localStorage.getItem('language') || 'en';
    }

    ngOnInit(): void {
      console.log(this.learningActivitySubmittedData);
      if (this.learningActivityId) {
        if (this.learningActivitySubmittedData.generalInformation.taskId) {
          this.getTaskByID(this.learningActivitySubmittedData.generalInformation.taskId)
        }
        const questions = [];
        for (let q in this.learningActivitySubmittedData.questions.learingActivityQuestions) {
          questions.push({
            score: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].score,
            learningActivityId: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].learningActivityUniqueId,
            needReview: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].needReview,
            titleChinese: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].titleChinese,
            titleEnglish: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].titleEnglish,
            type: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].type,
            interpretations: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].interpretations,
          });
          const answers = [];
          for (let a in this.learningActivitySubmittedData.questions.learingActivityQuestions[q].learingActivityQuestionAnswers) {
            answers.push({
              answerChinese: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].learingActivityQuestionAnswers[a].answerChinese,
              answerEnglish: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].learingActivityQuestionAnswers[a].answerEnglish,
              isCorrect: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].learingActivityQuestionAnswers[a].isCorrect,
            })
          }
          questions[q].answers = answers;
        };
        this.previewData.questions = questions
        this.previewData.titleChinese = this.learningActivitySubmittedData.generalInformation?.titleChinese;
        this.previewData.descriptionChinese = this.learningActivitySubmittedData.generalInformation?.descriptionChinese;
        this.previewData.totalScore = this.learningActivitySubmittedData.questions.totalScore;
        this.previewData.titleEnglish = this.learningActivitySubmittedData.generalInformation?.titleEnglish;
        this.previewData.descriptionEnglish = this.learningActivitySubmittedData.generalInformation?.descriptionEnglish;
      } else {
        this.commonService.showLoading();
        this.workplanData = Array(24).fill(0).map((x,i)=>{
          return {
            order: i + 1
          }
        }); 
        this.visualInspectionData = Array(12).fill(0).map((x,i)=>{
          return {
            order: i + 1
          }
        }); 
        if(this.learningActivityId) {
          this.previewData = this.learningActivitySubmittedData
        } else {
          this.learningActivityService.getLearningActivityByID(this.learningActivitySubmittedData.questions.learningActivityUniqueId).subscribe(res => {
            this.previewData = res.data;
            this.previewData.questions.forEach(q => {
              if (q.interpretations?.length > 0) {
                for(let i = 0; i < 12; i++) {
                  if (q.interpretations[i] === undefined) {
                    q.interpretations.push('');
                  }
                }
              }
            })
          }).add(() => {
            this.commonService.hideLoading();
          });
        }
        console.log(this.previewData)
      }
    }

    getTaskByID(taskID) {
      this.learningActivityService.getTaskByID(taskID).subscribe(res => {
        this.currentTask = res;
      })
    }
}
