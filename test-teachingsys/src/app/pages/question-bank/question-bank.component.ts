import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DATATABLE_ACTIONS } from '@app/@core/constants';
import { TableActionButton } from '@app/@core/interfaces';
import { LearningActivityService } from '@app/@core/services/learning-activity.service';
import { TranslateService } from '@ngx-translate/core';
import { QuestionBankService } from 'src/app/@core/services/question-bank.service';
import { TableField } from 'src/app/shared/tree-table/tree-table.interface';

@Component({
  selector: 'app-question-bank',
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.scss']
})
export class QuestionBankComponent implements OnInit {
  listOfMapData: any;
  tableFields: TableField[] = [
    {
      header: this.translate.instant('task_learning_activity'),
      fieldName: 'title'
    },
    {
      header: this.translate.instant('description'),
      fieldName: 'description'
    },
    {
      header: this.translate.instant('last_updated_date'),
      fieldName: 'updated'
    },
    {
      header: this.translate.instant('author'),
      fieldName: 'author'
    },
  ];
  actionButtons: TableActionButton[] = [];
  isVisible = false;
  modal = {
    title : '',
    content: ''
}
  onChoosenLearningActivity: any;
  constructor(
    private questionBankService: QuestionBankService,
    private learningActivityService: LearningActivityService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.questionBankService.getQuestionBank().subscribe(res => {
      this.listOfMapData = res
      // .map((item: any) => {
      //   return {...item, author: item.author.name}
      // })
    });
  }

  ngOnInit(): void {
    this.actionButtons = [
      {
          title: this.translate.instant('edit'),
          hasPermission: true,
          action: DATATABLE_ACTIONS.EDIT,
      },
      {
          title: this.translate.instant('delete'),
          hasPermission: true,
          action: DATATABLE_ACTIONS.DELETE,
      },
  ];
  }

  showModal(): void {
      this.isVisible = true;
  }
  
  handleOk(): void {
      this.isVisible = false;
      this.questionBankService
          .deleteLearningActivity(this.onChoosenLearningActivity)
          .subscribe({
            next: (v) => {
              this.questionBankService.getQuestionBank().subscribe(res => {
                this.listOfMapData = res
                // .map((item: any) => {
                //   return {...item, author: item.author.name}
                // })
              });
            },
            error: (e) => {
            },
            complete: () => console.info('complete')
          });
          this.router.navigate(['question-bank'])    
  }

  handleCancel(): void {
      this.isVisible = false;
  }

  viewDetail(e) {
    console.log(e)
    this.router.navigate(['question-bank/view-details/', e.id])
  }

  action(e) {
    if (e.action === 1) {
        this.router.navigate(['question-bank/edit', e.item.id], {queryParams: {type: 'QB'}});
    }
    else {
        this.modal = {
          // Are you sure you want to delete? 
            title : this.translate.instant('delete_confirm_title'),
            // This action can not be revised!
            content: this.translate.instant('delete_confirm_content')
        }
        this.onChoosenLearningActivity = e.item.id
        this.showModal();
    }
  }
}


