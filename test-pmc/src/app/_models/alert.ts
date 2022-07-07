export class Alert {
    id: string | undefined;
    type: AlertType = 0;
    message!: string;
    autoClose: boolean = false;
    keepAfterRouteChange: boolean | undefined;
    fade: boolean = false;

    constructor(init?:Partial<Alert>) {
        Object.assign(this, init);
    }
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}