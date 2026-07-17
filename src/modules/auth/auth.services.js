import ApiError from "../../common/utils/api-error.js"
import { generateResetToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.models.js"

const register = async ({ name, email, password }) =>{
    const existingUser = User.findOne({ email });

    if(existingUser) throw ApiError.conflict("Email already exisits")

    const { rawToken, hashedToken } = generateResetToken()

    const user = await User.create({ 
        name,
        email,
        password,
        role,
        verificationToken: hashedToken
    })
 
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.verificationToken

    // send an email to user with rawToken

}

export { register }