import express, { Request, Response, NextFunction } from "express";
import { VandorLogin } from "../controllers";
const router = express.Router();

router.post("/login", VandorLogin);
router.get("/profile");
router.patch("/profile");
router.patch("/service");

export { router as VandorRoute };
