import express, { Request, Response, NextFunction } from "express";
import {
  GetVandorProfile,
  UpdateVandorProfile,
  UpdateVandorService,
  VandorLogin,
} from "../controllers";
const router = express.Router();

router.post("/login", VandorLogin);
router.get("/profile", GetVandorProfile);
router.patch("/profile", UpdateVandorProfile);
router.patch("/service", UpdateVandorService);

export { router as VandorRoute };
