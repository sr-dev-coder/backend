import { Router } from "express";
import * as controller from "./auth.controller.js"
import { authenticate } from "./auth.middelware.js"
import validate from "../../common/middelware/validate.middelware.js"
import registerDto from "./dto/register.dto.js";
import loginDto from "./dto/login.dto.js";
import forgotPasswordDto from "./dto/forgot-password.dto.js";
import resetPasswordDto from "./dto/reset-password.dto.js";
import verifyEmailDto from "./dto/verify-email.dto.js";

const router = Router()

router.post("/register", validate(registerDto), controller.register)
router.post("/login", validate(loginDto), controller.login)
router.post("/refresh", controller.refresh)
router.post("/logout", authenticate, controller.logout)
router.post("/forgot-password", validate(forgotPasswordDto), controller.forgotPassword)
router.post("/reset-password", validate(resetPasswordDto), controller.resetPassword)
router.post("/verify-email", validate(verifyEmailDto), controller.verifyEmail)

export default router
