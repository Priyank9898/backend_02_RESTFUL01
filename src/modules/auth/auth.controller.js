import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async (req, res) => {
  const user = await authService.register(req.body);
  ApiResponse.created(res, { message: "Registration Successful", data: user });
};

const login = async (req, res) => {
  const login = await authService.login(req.body);
  ApiResponse.created(res, {
    message: "User successfully logged in",
    data: login,
  });
};

const logout = async (req, res) => {
  // TODO to send user id here
  const logout = await authService.logout(id);
  ApiResponse.created(res, { message: "User logged out", data: logout });
};

export { register, login };
