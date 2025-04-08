import { Request, Response, NextFunction } from "express";
import { EditVandorInput, VandorLoginInput } from "../dto";
import { Vandor } from "../models";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  CREATED,
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  ComparePassword,
  GenerateSignature,
} from "../utility";
import { FindVandor } from "./AdminController";

//login
export const VandorLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VandorLoginInput>req.body;

    const existingVandor = await FindVandor("", email);

    if (existingVandor !== null) {
      const validatePassword = await ComparePassword(
        password,
        existingVandor.password,
        existingVandor.salt
      );
      if (validatePassword) {
        const signature = GenerateSignature({
          _id: existingVandor.id,
          name: existingVandor.name,
          email: existingVandor.email,
          foodTypes: existingVandor.foodType,
        })
        return res
          .status(OK)
          .json(new ApiResponse(OK, signature, "Login Successful"));
      } else {
        throw new ApiError(BAD_REQUEST, "Invalid Password");
      }
    }
    throw new ApiError(NOT_FOUND, "Vendor not found");
  }
);
//profle
export const GetVandorProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
      const vandor = await Vandor.findById(user._id);
      if (vandor) {
        return res.status(OK).json(new ApiResponse(OK, vandor, "Vandor Profile"));
      }
      throw new ApiError(NOT_FOUND, "Vandor not found");
    }
  }
);
//update profile
export const UpdateVandorProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, address, foodType } = <EditVandorInput>req.body;
    const user = req.user;
    if (user) {
      const existingVandor = await FindVandor(user._id);
      if (existingVandor) {
        const updatedVandor = await Vandor.findByIdAndUpdate(
          user._id,
          {
            name,
            phone,
            address,
            foodType,
          },
          { new: true }
        );
        return res
          .status(OK)
          .json(new ApiResponse(OK, updatedVandor, "Vandor Profile Updated"));
      }
      throw new ApiError(NOT_FOUND, "Vandor not found");
    }
    throw new ApiError(BAD_REQUEST, "User not found");
  }
);
//update service
export const UpdateVandorService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
      const existingVandor = await FindVandor(user._id);
      if (existingVandor != null) {
        existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
        const savedVandor = await existingVandor.save();
        return res
          .status(OK)
          .json(new ApiResponse(OK, savedVandor, "Vandor Profile Updated"));
      }
      throw new ApiError(NOT_FOUND, "Vandor not found");
    }
  }
);
