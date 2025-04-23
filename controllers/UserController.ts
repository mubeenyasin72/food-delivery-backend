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
import { plainToClass } from "class-transformer"
import { validate } from "class-validator";
import { CreateUserInput } from "../dto/User.dto";


export const UserSignUp = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userInputs = plainToClass(CreateUserInput, req.body);
        const inputError = await validate(userInputs, { validationError: { target: true } })

        if(inputError.length > 0) {
            throw next(new ApiError(BAD_REQUEST, "Validation Error", inputError))
        }

        const {email, phone, password } = userInputs;
    })

export const UserSignIn = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => { })

export const UserVerify = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => { })

export const RequestOPT = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => { })

export const GetUserProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => { })

export const UpdateUserProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => { })
