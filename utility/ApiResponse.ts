export class ApiResponse {
    constructor(
        public statusCode: number,
        public data: any = {},
        public message: string = "Success",
        pagination: any = null
    ) {
        this.success = statusCode < 400;
        if (pagination) {
            this.pagination = pagination;
        }
    }

    public success: boolean;
    public pagination?: any;
}