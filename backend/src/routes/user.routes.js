import { Router } from "express";
import { getUserProfile, loginUser, registerUser } from "../controllers/user.controller.js";
import {  verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/me",).get(verifyJWT, getUserProfile)
export default router;