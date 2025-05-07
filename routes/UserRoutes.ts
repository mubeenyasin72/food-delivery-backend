import express from "express";
import {
    UserSignIn,
    UserSignUp,
    UserVerify,
    RequestOPT,
    GetUserProfile,
    UpdateUserProfile
} from "../controllers";
import { Authenticate } from "../middleware";

const router = express.Router();

// SignUp User
router.post("/signup", UserSignUp);

// SignIn User
router.post("/signin", UserSignIn);

//Authentication Required
router.use(Authenticate)
// Verify User
router.patch("/verify", UserVerify);

// OPT / Requesting OPT
router.get('/otp', RequestOPT)

// Profile
router.get("/profile", GetUserProfile);
router.patch("/profile", UpdateUserProfile);

// Cart

//Order

//Payment

export { router as UserRoutes };
