import express, { Request, Response, NextFunction } from "express";
import { CreateVandor, GetVandors, GetVandorById } from "../controllers";
import { Authenticate } from "../middleware";

const router = express.Router();

router.post("/create-vandor", Authenticate, CreateVandor);
router.get("/vandors", Authenticate, GetVandors);
router.get("/vandor/:id", Authenticate, GetVandorById);



export { router as AdminRoute };
