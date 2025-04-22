import { Request, Response, NextFunction } from "express";
import {
    ApiError,
    ApiResponse,
    asyncHandler,
    CREATED,
    OK,
    BAD_REQUEST,
    NOT_FOUND,
} from "../utility";


export const CreateCustomer = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        
    })