import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassManagementService } from '../../service/class-management.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentListItem } from '../../model/student.model';
import { StudentListComponent } from '../../student-list/student-list.component';

@Component({
  selector: 'app-class-creation-edit-dialog',
  templateUrl: './class-creation-edit-dialog.component.html',
  styleUrls: ['./class-creation-edit-dialog.component.scss']
})
export class ClassCreationEditDialogComponent implements OnInit {
  @ViewChild('unChosen') unChosenStudentList: StudentListComponent;
  @ViewChild('chosen') chosenStudentList: StudentListComponent;
  private _unchosenStudents: StudentListItem[] = [];
  private _chosenStudents: StudentListItem[] = [];
  private _selectedUnchosenStudents: StudentListItem[] = [];
  private _selectedChosenStudents: StudentListItem[] = [];
  private _formGroup: FormGroup;
  private _loading: boolean = false;
  public isDisabledSubmit: boolean = true;

  constructor(
    private _classManagementService: ClassManagementService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ClassCreationEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this._formGroup = this._formBuilder.group({
      class: [null, [Validators.required]],
      teacher: [null]
    });
    this._formGroup.get('class').valueChanges.subscribe(
      (data) => {
        console.log(data);
        this.isDisabledSubmit = data == null || data === '';
        console.log(this.isDisabledSubmit);
      }
    );
    this._loadData();
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  get unchosenStudents(): StudentListItem[] {
    return this._unchosenStudents;
  }

  get chosenStudents(): StudentListItem[] {
    return this._chosenStudents;
  }

  get loading(): boolean {
    return this._loading;
  }

  get isDisabledUnChosenToChosen(): boolean {
    return this._selectedUnchosenStudents.length === 0;
  }

  get isDisabledChosenToUnChosen(): boolean {
    return this._selectedChosenStudents.length === 0;
  }

  public unchosenStudentCheckHandle(ids: string[]): void {
    let selected: StudentListItem[] = [];
    this._unchosenStudents.forEach(
      (studentItem) => {
        if (ids.find(id => id === studentItem.id)) {
          selected.push(studentItem);
        }
      }
    );
    this._selectedUnchosenStudents = selected;
  }

  public chosenStudentCheckHandle(ids: string[]): void {
    let selected: StudentListItem[] = [];
    this._chosenStudents.forEach(
      (studentItem) => {
        if (ids.find(id => id === studentItem.id)) {
          selected.push(studentItem);
        }
      }
    );
    this._selectedChosenStudents = selected;
  }

  public handleMoveSelectedUnChosenToChosen(): void {
    this._loading = true;
    const tempChosen = this._chosenStudents;
    tempChosen.push(
      ...this._selectedUnchosenStudents
    );
    this._chosenStudents = tempChosen;
    const tempUnChosen = this._unchosenStudents;
    this._unchosenStudents = tempUnChosen.filter((item) => {
      return !this._selectedUnchosenStudents.find(selected => selected.id === item.id)
    });
    this._selectedUnchosenStudents = [];
    this._loading = false;
    this.unChosenStudentList.reloadTable(this._unchosenStudents);
    this.chosenStudentList.reloadTable(this._chosenStudents);
  }

  public handleMoveSelectedChosenToUnChosen(): void {
    this._loading = true;
    const tempUnchosen = this._unchosenStudents;
    tempUnchosen.push(
      ...this._selectedChosenStudents
    );
    this._unchosenStudents = tempUnchosen;
    const tempChosen = this._chosenStudents;
    this._chosenStudents = tempChosen.filter((item) => {
      return !this._selectedChosenStudents.find(selected => selected.id === item.id)
    });
    this._selectedChosenStudents = [];
    this._loading = false;
    this.unChosenStudentList.reloadTable(this._unchosenStudents);
    this.chosenStudentList.reloadTable(this._chosenStudents);
  }

  public submit(): void {
    // this._classManagementService.createClass(
    //   this._formGroup.get('class').value as string,
    //   this._chosenStudents.map(item => item.id)
    // ).subscribe(
    //   (data) => this.dialogRef.close(data)
    // );
  }

  private _loadData(): void {
    this._loading = true;
    this._classManagementService.getStudentListByClassId(1, 1000).subscribe(
      data => {
        console.log(data);
        this._unchosenStudents = data.content;
        this._loading = false;
      },
      _error => this._loading = true
    );
  }
}
