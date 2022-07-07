import { Receipt } from "./receipt";

export class PlaylistImageModel {
    id: number;
    imageFilePath: string;
    registrationDate: Date;
    imageLabel: string;
    alignment: string;
    type: string;
    remarks: string;
}
export class PlaylistModel {
    id: string;
    playlistLabel: string;
    remarks: string;
    playlistData: {
        standbyImages: PlaylistImageModel[],
        beforePaymentImage: PlaylistImageModel,
        afterPaymentImage: PlaylistImageModel,
        receiptImage: Receipt,
    }
    startDate?: Date;
    endDate?: Date;
    dateError?: boolean;


    constructor(model: any = null) {
        if (model) {
            this.id = model.id;
            this.playlistLabel = model.name;
            this.remarks = model.memo;
            this.playlistData = model.images;
        }
    }
}

export class PlaylistResponse {
    availablePages: number;
    page: number;
    availableElements: number;
    items: PlaylistModel []
}
