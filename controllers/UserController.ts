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
    GenerateSignature,
    ComparePassword
} from "../utility";
import { plainToClass } from "class-transformer"
import { validate } from "class-validator";
import { CreateUserInput, EditUserProfileInputs, UserLoginInput } from "../dto";
import { User } from "../models";


//User Signup
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

        // check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(BAD_REQUEST).json(
                new ApiResponse(BAD_REQUEST, {}, "User already exists")
            )
        }

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
            return;
        }
        res.status(BAD_REQUEST).json(new ApiResponse(BAD_REQUEST, {}, "User not created"))
    })

// User Login
export const UserSignIn = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const loginInputs = plainToClass(UserLoginInput, req.body);
        const loginError = await validate(loginInputs, { validationError: { target: true } })
        if (loginError.length > 0) {
            throw next(new ApiError(BAD_REQUEST, "Validation Error", loginError))
        }
        const { email, password } = loginInputs;
        const user = await User.findOne({ email: email });
        if (user) {
            const isPasswordMatched = await ComparePassword(password, user.password, user.salt);
            if (isPasswordMatched) {
                // genrate signature
                const signature = GenerateSignature({
                    _id: user.id,
                    email: user.email,
                    verified: user.verified,
                })
                res.status(OK).json(
                    new ApiResponse(OK, {
                        signature: signature,
                        email: user.email,
                        verified: user.verified,
                    }, "User SignIn",)
                )
                return;
            }
        }
        res.status(BAD_REQUEST).json(
            new ApiResponse(BAD_REQUEST, {}, "Error with SignIn")
        )
    })

// User Verify
export const UserVerify = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { otp } = req.body;
        const user = req.user;
        if (user) {
            const profile = await User.findById(user._id);
            if (profile) {
                if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                    profile.verified = true;
                    const updatedUserResponse = await profile.save();

                    // genrate signature
                    const signature = GenerateSignature({
                        _id: updatedUserResponse.id,
                        email: updatedUserResponse.email,
                        verified: updatedUserResponse.verified,
                    })
                    res.status(OK).json(
                        new ApiResponse(OK, {
                            signature: signature,
                            email: updatedUserResponse.email,
                            verified: updatedUserResponse.verified,
                        }, "User Verified",)
                    )
                    return;
                }
            }
        }
        res.status(BAD_REQUEST).json(
            new ApiResponse(BAD_REQUEST, {}, "Error with OTP verification")
        )
    })

export const RequestOPT = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (user) {
            const profile = await User.findById(user._id);
            if (profile) {
                const { otp, otp_expiry } = GenerateOtp();
                profile.otp = otp;
                profile.otp_expiry = otp_expiry;
                await profile.save();
                // send the opt to user
                await SendEmailOtp(profile.email, "Verify your account", `
                <h1>Verify your account</h1>
                <p>Use the following OTP to verify your account</p>
                <h2>${otp}</h2>
                <p>OTP is valid for 30 minutes</p>
                `)
                res.status(OK).json(
                    new ApiResponse(OK, {}, "OTP sent to your email")
                )
                return
            }
        }
        res.status(BAD_REQUEST).json(
            new ApiResponse(BAD_REQUEST, {}, "Error with OTP generation")
        )
    })
export const GetUserProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (user) {
            const profile = await User.findById(user._id);
            if (profile) {
                res.status(OK).json(
                    new ApiResponse(OK, profile, "User Profile",)
                )
                return;
            }
        }
        res.status(NOT_FOUND).json(
            new ApiResponse(NOT_FOUND, {}, "User not found")
        )
    })

export const UpdateUserProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        const profileInputs = plainToClass(EditUserProfileInputs, req.body);
        const inputError = await validate(profileInputs, { validationError: { target: true } })
        if (inputError.length > 0) {
            throw next(new ApiError(BAD_REQUEST, "Validation Error", inputError))
        }
        const { firstName, lastName, address } = profileInputs;
        if (user) {
            const profile = await User.findById(user._id);
            if (profile) {
                profile.firstName = firstName;
                profile.lastName = lastName;
                profile.address = address;
                const updatedUserResponse = await profile.save();
                res.status(OK).json(new ApiResponse(OK, updatedUserResponse, "User Profile",))
            }
        }
    })

