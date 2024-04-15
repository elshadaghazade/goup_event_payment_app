export interface ErrorResponse {
    code: number;
    details: string;
    message?: string;
}

export interface HttpResponseParams {
    headers?: { [key: string]: string };
    statusCode?: number;
}