import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto";
import { ROLES } from "../../../common/constants/roles";

// Design for validating the incoming data for registration

class RegisterDto extends BaseDto {
  static schema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).max(20).required(),
    role: Joi.string()
      .valid(Object.values(ROLES).toString())
      .default("customer"),
  });
}

export default RegisterDto;
