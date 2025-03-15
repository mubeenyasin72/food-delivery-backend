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
} from "../utility";
import { GenerateSalt, EncryptPassword } from "../utility";

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

    const existingVandor = await Vandor.findOne({ email: email });
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
    });
    return res
      .status(CREATED)
      .json(
        new ApiResponse(CREATED, createdVandor, "Vendor created successfully")
      );
  }
);

//Get All vanders
export const GetVandors = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vandors = await Vandor.find();
    return res
      .status(OK)
      .json(new ApiResponse(OK, vandors, "Vandors fetched successfully"));
  }
);

// Get Single vander
export const GetVandorById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const vandor = await Vandor.findById(id);
    if (!vandor) {
      throw new ApiError(404, "Vendor not found");
    }
    return res
      .status(OK)
      .json(new ApiResponse(OK, vandor, "Vendor fetched successfully"));
  }
);
