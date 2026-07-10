import { Router } from "express";
import * as controller from "./auth.controller.js"
import validate from "../../common/dto/base.dto.js"
import registerDto from "./dto/register.dto";


const router = Router()

route.post("/register", validate(registerDto), controller.regiser)

export default router