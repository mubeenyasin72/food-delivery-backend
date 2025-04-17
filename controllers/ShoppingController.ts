import express, { Request, Response, NextFunction } from 'express';
import { asyncHandler, ApiResponse, ApiError, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from '../utility';
import { Food, FoodDoc, Vandor } from '../models';



export const GetFoodAvailability = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { pincode } = req.params;
        const result = await Vandor.find({ pinCode: pincode, serviceAvailable: true })
            .sort([['rating', -1]])
            .populate("foods")
        if (result.length > 0) {
            res.status(OK).json(new ApiResponse(OK, result, "Food Available"));
            return;
        }
        res.status(NOT_FOUND).json(new ApiResponse(NOT_FOUND, [], "No Food Available"));
    }
)
export const GetTopRestaurants = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const pincode = req.params.pincode;
        const result = await Vandor.find({ pinCode: pincode, serviceAvailable: true })
            .sort([['rating', -1]])
            .limit(10)
        if (result.length > 0) {
            res.status(OK).json(new ApiResponse(OK, result, "Top Restaurants"));
            return;
        }
        res.status(NOT_FOUND).json(new ApiResponse(NOT_FOUND, [], "No Restaurants Found"));
    }
)
export const GetFoodIn30Min = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const pincode = req.params.pincode;
        const result = await Vandor.find({ pinCode: pincode, serviceAvailable: true })
            .populate("foods")
        if (result.length > 0) {
            let foodIn30Min: any = [];
            result.map((item) => {
                const foods = item.foods as [FoodDoc]
                foodIn30Min.push(...foods.filter((food) => food.readyTime <= 30))
            })
            res.status(OK).json(new ApiResponse(OK, foodIn30Min, "Food Available in 30 Minutes"));
            return;
        }
        res.status(NOT_FOUND).json(new ApiResponse(NOT_FOUND, [], "No Food Available in 30 Minutes"));
    }
)
export const SearchFood = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { pincode } = req.params;
        const result = await Vandor.find({ pinCode: pincode, serviceAvailable: true })
            .populate("foods")
        if (result.length > 0) {
            let foodResult: any = [];
            result.map((item)=>foodResult.push(...item.foods))
            res.status(OK).json(new ApiResponse(OK, foodResult, "Food Available in 30 Minutes"));
            return;
        }
        res.status(NOT_FOUND).json(new ApiResponse(NOT_FOUND, [], "No Food Available in 30 Minutes"));

    }
)
export const GetRestaurantById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const result = await Vandor.findById(id).populate("foods")
        if (result) {
            res.status(OK).json(new ApiResponse(OK, result, "Restaurant Found"));
            return;
        }
        res.status(NOT_FOUND).json(new ApiResponse(NOT_FOUND, [], "No Restaurant Found"));
    }
)