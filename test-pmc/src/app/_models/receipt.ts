import { CONTENT_TYPES } from "@app/_constants";

export class Receipt {
  id: string;
  receiptLabel: string;
  receiptXmlFilePath: string;
  remarks: string;
  thumbnailImageFilePath: string;
  lastUpdateDate: string
}

export class ReceiptResponse {
  availablePages: number;
  page: number;
  items: Receipt[];
}

export class ReceiptRequest {
  receiptLabel: string;
  remarks: string;
  thumbnail: string;
  contentData: ReceiptContentData[];
}

export class ReceiptContentData {
  contentType: CONTENT_TYPES
  scale: number
  position: number
  data: string
}
