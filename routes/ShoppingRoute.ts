import express, { Request, Response, NextFunction } from "express";
import { GetFoodAvailability, GetFoodIn30Min, GetRestaurantById, GetTopRestaurants, SearchFood } from "../controllers";

const router = express.Router();

/* ------------------- Food Availability --------------------- */
router.get('/:pincode', GetFoodAvailability )
/* ------------------- Top Restaurants --------------------- */
router.get("/top-restaurant/:pincode", GetTopRestaurants)
/* ------------------- Food Available in 30 Minutes --------------------- */
router.get("/food-in-30-min/:pincode",GetFoodIn30Min)
/* ------------------- SearchFood --------------------- */
router.get("/search/:pincode", SearchFood)
/* ------------------- Finf Restautant --------------------- */
router.get("/restaurant/:id", GetRestaurantById)

export { router as ShoppingRoute };