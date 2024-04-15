export class ClientError extends Error {
    public name: string;
    
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
      }
}