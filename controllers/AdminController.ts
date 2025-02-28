import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { ApiError, ApiResponse, asyncHandler, CREATED } from "../utility";

//CreateVandor
export const CreateVandor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      address,
      pincode,
      foodType,
      email,
      password,
      ownerName,
      phone,
    } = <CreateVandorInput>req.body;
    const createdVandor = await Vandor.create({
      name: name,
      address: address,
      pincode: pincode,
      foodType: foodType,
      email: email,
      password: password,
      salt: "",
      ownerName: ownerName,
      phone: phone,
      rating: 0,
      serviceAvailable: false,
      coverImages: [],
    });
    return res
      .status(201)
      .json(new ApiResponse(CREATED, createdVandor, "Vendor created successfully"));
  }
);

export const GetVandors = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const GetVandorById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
