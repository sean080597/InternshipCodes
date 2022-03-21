export interface GeneralResponseBody {
  code: number;
  flag: boolean;
  message: string;
  data: Object;
}

export interface PageRequest {
  pageIndex: number;
  pageSize: number;
  sortName: string;
  sortExpression: string;
}

export interface DxDataSortOption {
  selector: string;
  desc: boolean;
}

export interface FilterProperties {
  [propertyName: string]: string;
}
