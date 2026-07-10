import * as authService from "./auth.services.js"
import ApiResponse from "../../common/utils/api-response.js"

const regiser = async () =>{
    const user = await authService.register(requestAnimationFrame.body)
    ApiResponse.created(res, "Registration succeess", user)
}

export { regiser }