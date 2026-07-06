import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async (req, res) => {
  const user = await authService.register(req.body);
  return ApiResponse.created(res, {
    message: "Registration Successful",
    data: user,
  });
};

const verifyMail = async (req, res) => {
  const user = await authService.verifyEmail(req.params.token);

  return ApiResponse.ok(res, {
    message: "Email verified successfully",
    data: user,
  });
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
  return ApiResponse.ok(res, {
    message: "Logged out successfully",
  });
};

const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return ApiResponse.ok(res, { message: "User Profile", data: user });
};

const forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.body);
  return ApiResponse.ok(res, {
    message: "If the email is registered, a password link has been sent",
  });
};

const resetPassword = async (req, res) => {
  const token = req.params.token;
  const password = req.body.password;
  await authService.resetPassword(token, password);
  return ApiResponse.created(res, {
    message: "Password updated successfully",
  });
};

export {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  verifyMail,
  resetPassword,
};
