export class ClassListItem {
  key: number;
  id: string;
  title: string;
  description: string;
  numberOfGroup: number;
  studentCount: number;
  openTime: string;
  children: GroupListItem[];
}

export class GroupListItem {
  key: string;
  id: string;
  classId: string;
  title: string;
  description: string;
  studentCount: number;
  openTime: string;
}
