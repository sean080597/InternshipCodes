export const PAGING_CONFIGS = {
  ITEM_PER_PAGE: 120,
};

export const COMMON_CONFIGS = {
  INFINITE_TIME: '2099-12-31T23:59:59Z',
  TIME_ZONE: 'Asia/Tokyo',
  TIME_ZONE_OFFSET: '+0900',
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()\[\]\{\}=^*.?@\\\/,<>:;|_~`])[A-Za-z\d!"#$%&'()=^*\[\]\{\}.?@\\\/,<>:;|_~`]{8,20}$/,
  BASE64_IMG_REGEX: /^data:image\/(jpg|jpeg|png|gif);base64,/,
  IMAGE_REGEX: /\.(gif|jpe?g|png)$/,
  GIF_REGEX: /\.(gif)$/,
  JPEG_REGEX: /\.(jpe?g)$/,
  BREAK_LINE_REGEX: /\r?\n/,
  MOMENT_FORMAT_YYYY_MM_DD_d: 'YYYY-MM-DD',
  MOMENT_FORMAT_YYYY_MM_DD_s_HH_MM: 'YYYY/MM/DD HH:mm',
  MOMENT_FORMAT_YYYY_MM_DD_s_HH_MM_SS: 'YYYY/MM/DD HH:mm:ss',
  DATETIME_FORMAT_YYYY_MM_DD_s_HH_MM: 'yyyy/MM/dd HH:mm',
  DATETIME_FORMAT_YYYY_MM_DD_s_HH_MM_SS: 'YYYY/MM/dd HH:mm:ss',
  DATETIME_FORMAT_YYYY_MM_DD_s_HH_MM_SS_SSS: 'YYYY/MM/dd HH:mm:ss.SSS',
  DATETIME_FORMAT_YYYY_MM_DD_s_MON: 'YYYY/MM/dd (EEE)',
  DATETIME_FORMAT_yyyy_MM_DD_s_MON: 'yyyy/MM/dd (EEE)',
  DATETIME_FORMAT_YYYY_MM_DD: 'yyyy/MM/dd',
  DATETIME_FORMAT_YYYY_MM_DD_s_MON_HH_MM: 'yyyy/MM/dd (EEE) HH:mm',
};

export const INPUT_CONFIGS = {
  EMAIL_MAXLENGTH: 256,
  LABEL_MAXLENGTH: 20,
  REMARKS_MAXLENGTH: 512,
  HALF_INPUT_STANDARD: 32,
  HALF_INPUT_4TIMES: 16,
  PASSWORD_MAXLENGTH: 20,
  PASSWORD_MINLENGTH: 8,
  MAXLENGTH_100: 100,
  MAXLENGTH_250: 250,
  MAXLENGTH_64: 64,
}

export enum SERVICE_STATUS {
  START = 1,
  IN_USER = 2,
  END = 3,
}

export enum ROLES {
  ROLE_ALL = '',
  ROLE_SERVICE_ADMIN = 'ROLE_SERVICE_ADMIN',
  ROLE_MERCHANT_MANAGER = 'ROLE_MERCHANT_MANAGER',
  ACCOUNT_LOCKED  = 'ACCOUNT_LOCKED'
}

export const USER_STATUS = [
  { status: 'REQUESTING_REGISTRATION', label: 'LB_REQUEST_REGISTER' },
  { status: 'COMPLETION_REGISTRATION', label: 'LB_REGISTER_COMPLETE' },
  { status: 'ACCOUNT_LOCKED', label: 'LB_USER_LOCKED' },
];

export const USER_AUTHORITIES = [
  { role: ROLES.ROLE_SERVICE_ADMIN, label: 'LB_AUTHORITY_CLASSIFICATION_1' },
  { role: ROLES.ROLE_MERCHANT_MANAGER, label: 'LB_AUTHORITY_CLASSIFICATION_2' },
];

export enum SCALE_MODES {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
  CENTER = 'CENTER',
}

export enum SCALEMODE_VALUES {
  alignedVerticalWidth = 'alignedVerticalWidth',
  alignedWidth = 'alignedWidth',
  alignedCenter = 'alignedCenter',
  alignedWidthReduction = 'alignedWidthReduction',
  alignedUpperLeft = 'alignedUpperLeft',
  alignedTopCenter = 'alignedTopCenter'
}

export enum DESTINATION_TYPES {
  CUSTOMER_DISPLAY = 'CUSTOMER_DISPLAY',
  RECEIPT_IMAGE = 'RECEIPT_IMAGE',
}

export const IMAGE_LIST_TYPES = {
  imageListCustomerDisplay: DESTINATION_TYPES.CUSTOMER_DISPLAY,
  imageListReceiptImage: DESTINATION_TYPES.RECEIPT_IMAGE,
  receiptList: 'RECEIPT_LIST'
}

export enum SORTING_OPTS {
  ASC = 'asc',
  DESC = 'desc',
  LAST_ASC = 'LAST_UPDATE_DATE_ASC',
  LAST_DESC = 'LAST_UPDATE_DATE_DESC',
  PUBLICATION_START_DATE_ASC = 'PUBLICATION_START_DATE_ASC',
  PUBLICATION_START_DATE_DESC = 'PUBLICATION_START_DATE_DESC',
  EMAIL_ASC = 'EMAIL_ASC',
  EMAIL_DESC = 'EMAIL_DESC',
  OPERATION_ASC = 'OPERATION_DATE_ASC',
  OPERATION_DESC = 'OPERATION_DATE_DESC',
  TERMINAL_ASC = 'TERMINAL_ID_ASC',
  TERMINAL_DESC = 'TERMINAL_ID_DESC',
}

export const LIMIT_DIMENSIONS = [
  { typeId: DESTINATION_TYPES.CUSTOMER_DISPLAY, dimensions: { width: 800, height: 480 } },
  { typeId: DESTINATION_TYPES.RECEIPT_IMAGE, dimensions: { width: 384, height: 800 } }
]

export enum RECEIPT_INPUT_TYPES {
  STANDARD = 'standard',
  FOUR_TIMES = '4times',
  IMAGE_SELECTION = 'image-selection'
}

export enum CONTENT_TYPES {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE'
}

export enum FLOWS {
  TOPSCREEN = 'TOP-SCREEN',
  IMAGE = 'IMAGE',
  RECEIPT = 'RECEIPT',
  PLAYLIST = 'PLAYLIST',
  DISTRIBUTION = 'DISTRIBUTION',
  USAGE_RECORD = 'USAGE_RECORD',
  USER = 'USER',
  OPERATION = 'OPERATION',
  NOTIFICATION = 'NOTIFICATION',
}

export enum HISTORY_ACTIONS {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  DISPLAY = 'DISPLAY',
  PAGING = 'PAGING'
}
