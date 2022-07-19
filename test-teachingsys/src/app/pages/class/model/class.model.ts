import { Group } from "./group.model";

export class Class {
  uniqId: string;
  title: string;
  description: string;
  groups: Group[] = [];
  studentCount: number;
  teacherId: string;
  teacherNameChinese: string;
  teacherNameEnglish: string;
  creationTime: string;
}
