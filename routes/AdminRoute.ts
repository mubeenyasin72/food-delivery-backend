import express from "express";
import { CreateVandor, GetVandors, GetVandorById } from "../controllers";

const router = express.Router();

router.post("/create-vandor", CreateVandor);
router.get("/vandors", GetVandors);
router.get("/vandor/:id", GetVandorById);


export { router as AdminRoute };
