import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";

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
  const { rawToken } = await authService.forgotPassword(req.body);
  return ApiResponse.ok(res, {
    message: "If the email is registered, a password link has been sent",
    data: rawToken,
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

const refresh = async (req, res) => {
  const existingRefreshToken = req.cookies.refreshToken;
  if (!existingRefreshToken)
    throw ApiError.unAuthorized("No refresh token present in the request");

  const { userObj, accessToken, refreshToken } =
    await authService.refresh(existingRefreshToken);

  // Set the new refresh token in the cookie
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return ApiResponse.ok(res, {
    message: "Access token refreshed successfully",
    data: { userObj, accessToken },
  });
};

export {
  register,
  login,
  getMe,
  refresh,
  logout,
  forgotPassword,
  verifyMail,
  resetPassword,
};
