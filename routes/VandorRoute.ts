import express from "express";
import {
  GetVandorProfile,
  UpdateVandorProfile,
  UpdateVandorService,
  VandorLogin,
  UpdateVandorCoverImage,
  AddFood,
  GetFood,
} from "../controllers";
import { Authenticate } from "../middleware";
import { imageUpload } from "../utility";

const router = express.Router();

router.post("/login", VandorLogin);
router.use(Authenticate);
router.get("/profile", GetVandorProfile);
router.patch("/profile", UpdateVandorProfile);
router.patch('/cover-image', imageUpload, UpdateVandorCoverImage);
router.patch("/service", UpdateVandorService);

router.post("/food", imageUpload, AddFood);
router.get("/foods", GetFood)

export { router as VandorRoute };
