import BaseDto from "../../../common/dto/base.dto.js";
import Joi from "joi";

class ForgotDto extends BaseDto {
  static schema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
  });
}

export default ForgotDto;
