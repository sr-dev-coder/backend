import crypto from "crypto"
import ApiError from "../../common/utils/api-error.js"
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken } from "../../common/utils/jwt.utils.js";
import { sendVerificationEmail, sendResetPasswordEmail } from "../../common/utils/mailer.utils.js"
import User from "./auth.models.js"

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex")

const register = async ({ name, email, password, role }) =>{
    const existingUser = await User.findOne({ email });

    if(existingUser) throw ApiError.conflict("Email already exists")

    const { rawToken, hashedToken } = generateResetToken()

    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken: hashedToken
    })

    await sendVerificationEmail(user.email, rawToken)

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.verificationToken

    return userObj
}

const login = async({ email, password }) =>{
    const user = await User.findOne({ email }).select("+password")

    if(!user){
        throw ApiError.unauthorized("Invalid email or password")
    }

    const isPasswordValid = await user.comparePassword(password)

    if(!isPasswordValid){
        throw ApiError.unauthorized("Invalid email or password")
    }

    if(!user.isVerified){
        throw ApiError.unauthorized("Please verify your email before logging in")
    }

    const accessToken = generateAccessToken({ id: user._id })
    const refreshToken = generateRefreshToken({ id: user._id })

    user.refreshToken = hashToken(refreshToken)

    await user.save({ validateBeforeSave: false })

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.refreshToken

    return { user: userObj, accessToken, refreshToken }
}

const refresh = async({ token }) =>{
    if(!token){
        throw ApiError.unauthorized("Refresh token is missing")
    }

    const decoded = verifyRefreshToken(token)

    const user = await User.findById(decoded?.id).select("+refreshToken")

    if(!user) throw ApiError.unauthorized("User does not exist")

    if(user.refreshToken !== hashToken(token)){
        throw ApiError.unauthorized("Invalid refresh token")
    }

    const accessToken = generateAccessToken({ id: user._id })
    const refreshToken = generateRefreshToken({ id: user._id })

    user.refreshToken = hashToken(refreshToken)
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}

const logout = async({ userId }) =>{
    await User.findByIdAndUpdate(userId, { refreshToken: null })
}

const getMe = async ({ userId }) =>{
    const user = await User.findById(userId)

    if(!user) throw ApiError.notFound("User does not exist")

    return user.toObject()
}

const forgotPassword = async ({ email }) =>{
    const user = await User.findOne({ email })
    if(!user){
        throw ApiError.notFound("Email does not exist")
    }

    const { rawToken, hashedToken } = generateResetToken()

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000

    await user.save({ validateBeforeSave: false })

    await sendResetPasswordEmail(user.email, rawToken)
}

const resetPassword = async ({ token, password }) =>{
    const hashedToken = hashToken(token)

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    }).select("+resetPasswordToken +resetPasswordExpires")

    if(!user){
        throw ApiError.badRequest("Reset token is invalid or has expired")
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    user.refreshToken = undefined

    await user.save()
}

const verifyEmail = async ({ token }) =>{
    const hashedToken = hashToken(token)

    const user = await User.findOne({ verificationToken: hashedToken }).select("+verificationToken")

    if(!user){
        throw ApiError.badRequest("Verification token is invalid")
    }

    user.isVerified = true
    user.verificationToken = undefined

    await user.save({ validateBeforeSave: false })
}

export { register, login, refresh, logout, getMe, forgotPassword, resetPassword, verifyEmail }
