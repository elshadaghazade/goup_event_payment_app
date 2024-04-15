export interface IHttpErrorParams {
    code: number;
    details: string;
    headers: any;
}

export class HttpError {
    code!: number;
    details!: string;
    headers: any;

    constructor(params: IHttpErrorParams) {
        this.code = params.code;
        this.details = params.details;
        this.headers = params.headers;
    }
}