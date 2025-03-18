import { Request, Response, NextFunction } from "express";
import { VandorLoginInput } from "../dto";
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
        return res
          .status(OK)
          .json(new ApiResponse(OK, existingVandor, "Login Successful"));
      } else {
        throw new ApiError(BAD_REQUEST, "Invalid Password");
      }
    }
    throw new ApiError(NOT_FOUND, "Vendor not found");
  }
);
//profle
export const GetVandorProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
//update profile
export const UpdateVandorProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
//update service
export const UpdateVandorService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
