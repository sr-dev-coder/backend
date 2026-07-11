import ApiError from "../../common/utils/api-error.js"
import User from "./auth.models.js"

const register = async ({ name, email, password }) =>{
    const existingUser = User.findOne({ email });

    if(existingUser) throw ApiError.
}

export { register }