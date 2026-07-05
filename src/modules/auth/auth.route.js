import { Router } from "express";
import validate from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import * as controller from "./auth.controller.js";
import LoginDto from "./dto/login.dto.js";
import { authenticate } from "./auth.middleware.js";
import ForgotDto from "./dto/forgot.dto.js";

const router = Router();

router.post("/register", validate(RegisterDto), controller.register);
router.post("/login", validate(LoginDto), controller.login);
router.get("/me", authenticate, controller.getMe);
router.post("/logout", authenticate, controller.logout);
router.post("/forgot-password", validate(ForgotDto), controller.forgotPassword);
