export const SNACKBAR_DURATION = 3000;

export const MULTI_SORT_DELIMITER = '+';

export enum UserRole {
  empty = 0,
  user = 1,
  keyUser = 3,
  countryAdmin = 5,
  regionalAdmin = 7,
  globalAdmin = 9,
}

export enum ViewType {
  containerView = '1',
  shipmentView = '2',
  materialView = '3',
  truckView = '4',
}

export const FORWARDER_CONST = [
  { name: 'ff-dachser', value: 'ff-dachser' },
  { name: 'ff-dsv', value: 'ff-dsv' },
  { name: 'ff-hartrodt', value: 'ff-hartrodt' },
  { name: 'ff-hellmann', value: 'ff-hellmann' },
  { name: 'ff-kuehne+nagel', value: 'ff-kuehne+nagel' },
  { name: 'ff-nippon express', value: 'ff-nippon express' },
  { name: 'ff-panalpina', value: 'ff-panalpina' },
  { name: 'ff-schenker', value: 'ff-schenker' },
];

export const TIMESCALE_CONST = [
  { name: 'Week', value: 'week' },
  { name: 'Month', value: 'month' },
];

export const VIEWTYPE_CONST = [
  { name: 'Container', value: 1 },
  { name: 'Shipment', value: 2 },
];

export const REGIONS_CONST = [
  { name: 'Greater China', value: 1 },
  { name: 'Asia Pacific', value: 3 },
  { name: 'Europe', value: 2 },
  { name: 'America', value: 4 },
];

export const MY_FORMATS = {
  parse: {
    parsedateInput: 'DD MMM YYYY', // moment format
  },
  display: {
    dateInput: 'YYYY-MM-DD', // moment format
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const COUNTRIES_CONST = [
  {
    letter: 'A',
    names: ['AR', 'AT', 'AE', 'AU'],
  },
  {
    letter: 'B',
    names: ['BR'],
  },
  {
    letter: 'C',
    names: ['CA', 'CL', 'CN', 'CO', 'CZ', 'CH'],
  },
  {
    letter: 'D',
    names: ['DK', 'DE'],
  },
  {
    letter: 'E',
    names: ['ES'],
  },
  {
    letter: 'F',
    names: ['FI', 'FR'],
  },
  {
    letter: 'G',
    names: ['GB'],
  },
  {
    letter: 'H',
    names: ['HK', 'HU'],
  },
  {
    letter: 'I',
    names: ['IN', 'ID', 'IL', 'IT'],
  },
  {
    letter: 'J',
    names: ['JP'],
  },
  {
    letter: 'K',
    names: ['KR'],
  },
  {
    letter: 'M',
    names: ['MY', 'MX'],
  },
  {
    letter: 'N',
    names: ['NL', 'NO'],
  },
  {
    letter: 'P',
    names: ['PE', 'PH', 'PL', 'PT'],
  },
  {
    letter: 'R',
    names: ['RO', 'RU'],
  },
  {
    letter: 'S',
    names: ['SG', 'SK', 'SI', 'SE'],
  },
  {
    letter: 'T',
    names: ['TW', 'TH', 'TR'],
  },
  {
    letter: 'U',
    names: ['UA', 'US'],
  },
  {
    letter: 'V',
    names: ['VN'],
  },
  {
    letter: 'Z',
    names: ['ZA'],
  },
];

export const FILTER_TYPES = {
  createFilter: 'Create Filter',
  cleanFilter: 'Clean Filter',
};

export const LAYOUT_TYPES = {
  setColumn: 'Set Column',
  manageView: 'Manage View',
};

export const MAXIMUM_CONDITIONS = 5;

export const EXCEPT_COLUMNS = ['shipmentNumber', 'roNumber', 'Action'];

export const SUMMARY_WIDGETS = ['Total shipments in last 7 days', 'total urgent shipments in last 7 days', 'total shipments req. delivery today'];

export const SHIPMENT_LOGS_LIST = [
  { index: 1, status: 'Pickup at Shipping Point' },
  { index: 2, status: 'Arriving Consol. Center' },
  { index: 3, status: 'Leaving Consol. Center' },
  { index: 4, status: 'Transport in Main-Carriage' },
  { index: 5, status: 'Arriving Dist. Center' },
  { index: 6, status: 'Leaving Dist. Center' },
  { index: 7, status: 'Receiving at Consignee' },
];
