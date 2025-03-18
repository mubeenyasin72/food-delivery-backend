import express, {Request, Response, NextFunction} from "express";
import {VandorLogin} from "../controllers";
const router = express.Router();

router.post("/login", VandorLogin);


export {router as VandorRoute};