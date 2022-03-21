import { GeneralResponseBody } from '@shared/shared.model';

export interface TruckTrackingRequestBody {
  actualDeliveryDateFrom?: string;
  actualDeliveryDateTo?: string;
  actualPickupDateFrom?: string;
  actualPickupDateTo?: string;
  customerCode?: string;
  customerName?: string;
  supplierName?: string;
  milestone?: string;
  operatorCode?: string;
  pageRequest?: {
    pageIndex: number;
    pageSize: number;
    sortExpression: string;
    sortName: string;
  };
  plannedPickupDateFrom?: string;
  plannedPickupDateTo?: string;
  requiredDeliveryDateFrom?: string;
  requiredDeliveryDateTo?: string;
  shipToCity?: string;
  destinationRegion?: string;
  shipmentNumber?: string;
  shippingPoint?: string;
  shipToParty?: string;
  status?: string;
  transportType?: string;
  viewType?: string;
  filter?: string;
}

export interface TruckTracking {
  actualDeliveryDate: string;
  actualPickupDate: string;
  customerCode: string;
  supplierName: string;
  milestones: string;
  operatorCode: string;
  plannedPickupDate: string;
  requiredDeliveryDate: string;
  destinationCity: string;
  shipmentNumber: string;
  shippingPoint: string;
  status: string;
  transportType: string;

  id: number;
  idFromSupplier: string;
  shippingCondition: string;
  departureCity: string;
  startLatitude: string;
  startLongitude: string;
  endLatitude: string;
  endLongitude: string;
  currentLatitude: string;
  currentLongitude: string;
  truckNumber: string;
  routeName: string;
  routeId: string;
  statusRemark: string;
  cityRemark: string;
  sendStat: string;
  sendTime: string;
  updateTime: string;
  active: string;
  region: string;
  country: string;
  ctime: string;

  favorite?: boolean;
  remarked?: boolean;
  remarkKey?: string;

  statusColor?: number;
  revisedReqDeliveryDate?: string;
  lspRemark?: string;
  estDeliveryDate?: string;
  customerName: string;
  roNumber: string;
}

export const DATE_PROPERTY_MAPPER = {
  actualDeliveryDate: {
    from: 'actualDeliveryDateFrom',
    to: 'actualDeliveryDateTo',
  },
  actualPickupDate: {
    from: 'actualPickupDateFrom',
    to: 'actualPickupDateTo',
  },
  plannedPickupDate: {
    from: 'plannedPickupDateFrom',
    to: 'plannedPickupDateTo',
  },
  requiredDeliveryDate: {
    from: 'requiredDeliveryDateFrom',
    to: 'requiredDeliveryDateTo',
  },
  estDeliveryDate: {
    from: 'estDeliveryDateFrom',
    to: 'estDeliveryDateTo',
  },
  updateDate: {
    from: 'updateDateFrom',
    to: 'updateDateTo',
  },
};

export interface TruckTrackingResponseBody extends GeneralResponseBody {
  data: {
    content: TruckTracking[];
    totalElements: number;
    last: boolean;
    totalPages: number;
    first: boolean;
    size: number;
    numberOfElements: number;
    empty: boolean;
  };
}

export interface ManageViewRequestBody {
  userId: number;
  viewName: string;
  viewDesc: string;
  columnList: string[];
  filterInfo: FilterInfo[];
  sortInfo: SortInfo[];
}

export interface FilterInfo {
  field: string;
  operator: string;
  value: string;
  from?: string;
  to?: string;
}

export interface SortInfo {
  field: string;
  expression: string;
}

export interface ManageViewResponseBody extends GeneralResponseBody {
  data: ManageViewItem[];
}

export interface ManageViewItem extends ManageViewRequestBody {
  id: number;
  status: number;
  createDatetime: string;
}

export interface ActiveViewResponseBody extends GeneralResponseBody {
  data: {
    active: boolean;
    view: ManageViewItem;
  };
}

export interface SummaryWidgetResponseBody extends GeneralResponseBody {
  data: {
    total: number;
    normalSN?: number;
    riskySN?: number;
    delayedSN?: number;
    deliveredSN?: number;
    transitSN?: number;
  };
}

export interface SummaryWidgetData {
  widgetType: number;
  responseData: SummaryWidgetResponseBody;
}

export interface ShipmentLogsResponseBody extends GeneralResponseBody {
  data: ShipmentLog[];
}

export interface ShipmentLog {
  index: number;
  color: number;
  status: string;
  updateTime: string;
}

export interface FilterDataResponseBody extends GeneralResponseBody {
  data: {
    transType: string[];
    lsp: string[];
    opCode: string[];
    shippingPoint: string[];
    shipToParty: string[];
    destinationCity: string[];
    destinationRegion: string[];
    customerCode: string[];
    milestones: {
      key: number;
      value: string;
    }[];
  };
}

export enum TruckTrackingStatus {
  undefine = 0,
  green = 1,
  yellow = 2,
  red = 3,
}

export enum TruckTrackingMilestones {
  waitingForPick = 'Waiting for Pick',
  picked = 'Picked',
  inMainCarriage = 'In Main Carriage',
  inDistributionWarehouse = 'In Distribution Warehouse',
  inDistribution = 'In Distribution',
  received = 'Received',
  cancel = 'Cancel',
}

export class Change<T> {
  type: 'insert' | 'update' | 'remove';
  key: any;
  data: Partial<T>;
}

export interface TruckViewSource {
  columns: string[];
  filter: TruckTrackingRequestBody;
  sort: Array<any>;
}
