export interface Users {
  id:string;
  emailAddress:string;
  companyName:string;
  authorities:string;
  registrationDate:string;
  lastUpdateDate:string;
  lastLoginDate:string;
  status:string;
  isDeleting?:boolean
}

export class UserResponse {
  availablePages: number;
  page: number;
  items: Users[];
}

export class Company {
  id: number;
  companyName: string;
}

export class CompanyResponse {
  page: number;
  availablePages: number;
  availableElements: number;
  items: Company[];
}