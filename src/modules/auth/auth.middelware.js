import ApiError from "../../common/utils/api-error.js"
import { verifyAccessToken } from "../../common/utils/jwt.utils.js"

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return next(ApiError.unauthorized("Access token is missing"))
    }

    const token = authHeader.split(" ")[1]

    try{
        const decoded = verifyAccessToken(token)
        req.user = { id: decoded.id }
        next()
    }catch(err){
        next(ApiError.unauthorized("Invalid or expired access token"))
    }
}

export { authenticate }
