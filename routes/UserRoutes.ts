import express from "express";
import { CreateCustomer } from "../controllers";

const router = express.Router();

router.post("/create", CreateCustomer);



export { router as UserRoutes };
