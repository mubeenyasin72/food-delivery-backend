import { Request, Response, NextFunction } from "express";
import {
    ApiError,
    ApiResponse,
    asyncHandler,
    CREATED,
    OK,
    BAD_REQUEST,
    NOT_FOUND,
    GenerateSalt,
    EncryptPassword,
    GenerateOtp,
    SendEmailOtp,
    GenerateSignature
} from "../utility";
import { plainToClass } from "class-transformer"
import { validate } from "class-validator";
import { CreateUserInput } from "../dto";
import { User } from "../models";


export const UserSignUp = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userInputs = plainToClass(CreateUserInput, req.body);
        const inputError = await validate(userInputs, { validationError: { target: true } })

        if (inputError.length > 0) {
            throw next(new ApiError(BAD_REQUEST, "Validation Error", inputError))
        }

        const { email, phone, password } = userInputs;
        const salt = await GenerateSalt();
        const userPassword = await EncryptPassword(password, salt);

        const { otp, otp_expiry } = GenerateOtp();

        const result = await User.create({
            email: email,
            password: userPassword,
            salt: salt,
            phone: phone,
            otp: otp,
            otp_expiry: otp_expiry,
            firstName: "",
            lastName: "",
            address: "",
            verified: false,
            lat: 0,
            lng: 0
        })
        if (result) {
            // send the opt to user
            await SendEmailOtp(result.email, "Verify your account", `
            <h1>Verify your account</h1>
            <p>Use the following OTP to verify your account</p>
            <h2>${otp}</h2>
            <p>OTP is valid for 30 minutes</p>
            `)
            // generate the signature
            const signature = GenerateSignature({
                _id: result.id,
                email: result.email,
                verified: result.verified,
            })
            //send the result to user
            res.status(CREATED).json(
                new ApiResponse(CREATED, {
                    signature: signature,
                    email: result.email,
                    verified: result.verified,
                }, "User Created",)
            )
        }
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
