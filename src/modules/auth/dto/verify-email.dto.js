import Joi from "joi"
import BaseDto from "../../../common/dto/base.dto.js"

class verifyEmailDto extends BaseDto{
    static schema = Joi.object({
        token: Joi.string().required()
    })
}

export default verifyEmailDto
