import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  CREATED,
  OK,
  BAD_REQUEST,
  NOT_FOUND,
} from "../utility";
import { GenerateSalt, EncryptPassword } from "../utility";
import { isValidObjectId } from "mongoose";
import { FindVandor } from "../helper";

//Helper Function

//CreateVandor
export const CreateVandor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      address,
      pinCode,
      foodType,
      email,
      password,
      ownerName,
      phone,
    } = <CreateVandorInput>req.body;

    const existingVandor = await FindVandor("", email);
    if (existingVandor) {
      throw new ApiError(BAD_REQUEST, "Vendor already exists");
    }

    const salt = await GenerateSalt();
    const userPassword = await EncryptPassword(password, salt);

    const createdVandor = await Vandor.create({
      name: name,
      address: address,
      pinCode: pinCode,
      foodType: foodType,
      email: email,
      password: userPassword,
      salt: salt,
      ownerName: ownerName,
      phone: phone,
      rating: 0,
      serviceAvailable: false,
      coverImages: [],
      foods: [],
    });
    return res
      .status(CREATED)
      .json(
        new ApiResponse(CREATED, createdVandor, "Vendor created successfully")
      );
  }
);

//Get All vandors
export const GetVandors = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vandors = await Vandor.find();
    if (vandors !== null) {
      return res
        .status(OK)
        .json(new ApiResponse(OK, vandors, "Vandors fetched successfully"));
    }
    return res.json(new ApiResponse(OK, [], "No vandors found"));
  }
);

// Get Single vandor
export const GetVandorById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const vandor = await FindVandor(id);
    if (!vandor) {
      throw new ApiError(NOT_FOUND, "Vendor not found");
    }
    return res
      .status(OK)
      .json(new ApiResponse(OK, vandor, "Vendor fetched successfully"));
  }
);
