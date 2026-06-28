import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto";

class loginDto extends BaseDto {
  static schema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string()
      .min(8)
      .max(20)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
  });
}

export default loginDto;
