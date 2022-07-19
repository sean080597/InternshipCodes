export class GradeListItem {
  id: string;
  task: string;
  learningActivity: string;
  finalGrade: string;
}

export interface FieldConfig {
  header: string;
  fieldName: string;
  width: string;
  filter: {
    searchValue: string,
    searchVisible: boolean,
    filterVisible: boolean
  }
}
