import { Group } from './group.model';

export class Student {
  id: string;
  fullName: string;
  fullNameEnglish: string;
  fullNameChinese: string;
  classUniqId: string;
  groupUniqId: string;
  email: string;
  phone: string;
  groups: Group[] = [];
}

export class StudentListItem extends Student {
  key: number;
  group: string;
}
