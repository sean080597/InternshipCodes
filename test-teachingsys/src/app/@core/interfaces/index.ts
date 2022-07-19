export interface TableActionButton {
    title: string;
    hasPermission: boolean;
    action: number;
}

export interface TriggerSubmitFlag {
    generalInfo: boolean;
    questions: boolean;
    preview: boolean;
}

export interface GeneralInformationFormFields {
    titleChinese: string;
    titleEnglish?: string;
    descriptionChinese?: string;
    descriptionEnglish?: string;
    attachments?: any;
    taskId?: any;
}

export interface Filter {
    pageSize: number
    pageIndex: number
    totalCount: number
}
