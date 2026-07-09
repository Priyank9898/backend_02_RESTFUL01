import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";
import { ROLES } from "../../../common/constants/roles.js";

// Design for validating the incoming data for registration

class RegisterDto extends BaseDto {
  static schema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),

    email: Joi.string().trim().lowercase().email().required(),

    password: Joi.string().min(8).max(20).required(),

    role: Joi.string()
      .valid(...Object.values(ROLES))
      .default(ROLES.CUSTOMER),
  });
}

export default RegisterDto;
