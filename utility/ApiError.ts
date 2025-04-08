export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string = "Something went wrong",
        public error: any[] = [],
        stack: string = ""
    ) {
        super(message);
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}