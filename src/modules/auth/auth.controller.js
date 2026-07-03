import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async (req, res) => {
  const user = await authService.register(req.body);
  ApiResponse.created(res, { message: "Registration Successful", data: user });
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // Refresh Token --> 7 days
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return ApiResponse.ok(res, {
    message: "Login successful",
    data: { user, accessToken },
  });
};

const logout = async (req, res) => {
  // TODO to send user id here
  await authService.logout(req.user.id);
  res.clearCookie("refreshToken");
  ApiResponse.ok(res, {
    message: "Logged out successfully",
  });
};

const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  ApiResponse.ok(res, { message: "User Profile", data: user });
};

export { register, login, getMe };
