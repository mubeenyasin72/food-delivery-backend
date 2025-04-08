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
    // Define how the object should be serialized to JSON
    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            error: this.error
        };
    }
}