import ApiError from "../utils/api-error.js";

//* this will act as a MIDDLEWARE which has req,res & next

const validate = (DtoClass) => {
  return (req, res, next) => {
    const { errors, value } = DtoClass.validate(req.body);
    if (errors) {
      throw ApiError.badRequest(errors.join("; "));
    }
    req.body = value;
    next();
  };
};

export default validate;
