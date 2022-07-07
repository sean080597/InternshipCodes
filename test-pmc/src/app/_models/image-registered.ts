import { SCALE_MODES } from "@app/_constants";

export class ImageRegistered{
  id:string;
  imageLabel:string;
  imageFilePath: string;
  registrationDate: string;
  type: string
  remarks: string
  alignment: SCALE_MODES;
  lastUpdateDate: string;
  thumbnailImageFilePath: string;
}

export class ImageRegisteredResponse{
  availableElements: number
  availablePages: number
  page: number
  items: ImageRegistered[]
}
