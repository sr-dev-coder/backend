import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ["customre", "seller", "admin"],
        default: "customer"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: { type: String, select: false },
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: String, select: false }
}, { 
    timestamps: true
})

export default mongoose.model("User", userSchema)