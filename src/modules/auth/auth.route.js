import { Router } from "express";
import validate from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import * as controller from "./auth.controller.js";
import LoginDto from "./dto/login.dto.js";
import { authenticate } from "./auth.middleware.js";
import ForgotDto from "./dto/forgot.dto.js";
import ResetPasswordDto from "./dto/rest-password.dto.js";

const router = Router();

// Register a new user
router.post("/register", validate(RegisterDto), controller.register);

// Verify email
router.get("/verify-email/:token", controller.verifyMail);

// Login user
router.post("/login", validate(LoginDto), controller.login);

// Get user profile
router.get("/me", authenticate, controller.getMe);

// Logout user
router.post("/logout", authenticate, controller.logout);

// Forgot password
router.post("/forgot-password", validate(ForgotDto), controller.forgotPassword);

// Reset password
router.post(
  "/reset-password/:token",
  validate(ResetPasswordDto),
  controller.resetPassword,
);

// refresh token
router.post("/refresh-token", controller.refresh);

export default router;
