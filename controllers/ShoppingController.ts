import express, { Request, Response, NextFunction } from 'express';
import { asyncHandler, ApiResponse, ApiError, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from '../utility';
import { Food, Vandor } from '../models';



export const GetFoodAvailability = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { pincode } = req.params;
        const result = await Vandor.find({ pinCode: pincode, serviceAvailable: true })
            .sort([['rating', -1]])
            .populate("foods")
        if (result.length > 0) {
            return res.status(OK).json(new ApiResponse(OK, result, "Food Available"));
        }
        return res.status(NOT_FOUND).json(new ApiResponse(NOT_FOUND, [], "No Food Available"));
    }
)
export const GetTopRestaurants = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

    }
)
export const GetFoodIn30Min = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

    }
)
export const SearchFood = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

    }
)
export const GetRestaurantById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

    }
)