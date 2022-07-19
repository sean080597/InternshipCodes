import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { INTERPRETATION, NULL_UUID } from '@app/@core/constants';
import { CommonService } from '@app/@core/services/common.service';
import { QuestionBankService } from '@app/@core/services/question-bank.service';
interface ItemData {
    key: number;
    steps: string;
    checkList: string;
    workSafetyEnvironmental: string;
    workingHours: string;
    notes: string;
}
@Component({
    selector: 'app-view-details',
    templateUrl: './view-details.component.html',
    styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent implements OnInit {
    @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
    @Input() learningActivitySubmittedData: any = {};
    learningActivity: any = {};
    currentLang: string = 'en';
    previewData: any = {};
    nullUuid = NULL_UUID;
    workplanData: any = [];
    visualInspectionData: any = [];
    imageAllowedExt = ['jpg', 'png', 'jpeg'];
    interpretation = INTERPRETATION;
    learningActivityId: string;
      constructor(
        private route: ActivatedRoute,
        private questionBankService: QuestionBankService,
        public commonService: CommonService
      ) {
        this.learningActivityId = this.route.snapshot.paramMap.get('id');
        this.currentLang = localStorage.getItem('language') || 'en';
      }
  
      ngOnInit(): void {
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
        this.questionBankService.getLearningActivityByID(this.learningActivityId).subscribe(res => {
          this.previewData = res.data;
          console.log(this.previewData)
          this.previewData.questions.forEach(q => {
            if (q.interpretations?.length > 0) {
              for(let i = 0; i < 12; i++) {
                if (q.interpretations[i] === undefined) {
                  q.interpretations.push('');
                }
              }
            }
          })
        });
      }
  
}

