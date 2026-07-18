import * as authService from "./auth.services.js"
import ApiResponse from "../../common/utils/api-response.js"

const register = async (req, res) => {
    const user = await authService.register(req.body)
    ApiResponse.created(res, "User registered successfully. Please check your email to verify your account.", user)
}

const login = async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body)
    ApiResponse.ok(res, "Login successful.", { user, accessToken, refreshToken })
}

const refresh = async (req, res) => {
    const { accessToken, refreshToken } = await authService.refresh({ token: req.body.refreshToken })
    ApiResponse.ok(res, "Token refreshed successfully.", { accessToken, refreshToken })
}

const logout = async (req, res) => {
    await authService.logout({ userId: req.user.id })
    ApiResponse.ok(res, "Logout successful.")
}

const getMe = async (req, res) => {
    const user = await authService.getMe({ userId: req.user.id })
    ApiResponse.ok(res, "User fetched successfully.", user)
}

const forgotPassword = async (req, res) => {
    await authService.forgotPassword(req.body)
    ApiResponse.ok(res, "Password reset email sent.")
}

const resetPassword = async (req, res) => {
    await authService.resetPassword(req.body)
    ApiResponse.ok(res, "Password reset successfully.")
}

const verifyEmail = async (req, res) => {
    await authService.verifyEmail(req.body)
    ApiResponse.ok(res, "Email verified successfully.")
}

export { register, login, refresh, logout, getMe, forgotPassword, resetPassword, verifyEmail }
