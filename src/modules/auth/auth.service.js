import ApiError from "../../common/utils/api-error.js";
import { hashToken } from "../../common/utils/hash-value.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw ApiError.conflict("User already exist");

  const { rawToken, hashedToken } = generateResetToken();

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: hashedToken,
  });

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.verificationToken;

  return {
    userObj,
    verificationToken: rawToken,
  };
};

const login = async ({ email, password }) => {
  /**
   ** Check if input is given done
   ** is email in the DB ? also get the password
   ** Check if user if verified
   ** compare password
   ** if correct generate refresh and access token
   ** hash refresh token and save it in DB and give user access and refresh token
   */

  if (!email || !password)
    throw ApiError.badRequest("Kindly enter email and password");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const isMatchPassword = await user.comparePassword(password);
  if (!isMatchPassword)
    throw ApiError.unauthorized("Invalid email or password");

  if (!user.isVerified) throw ApiError.unAuthorized("Please verify your email");

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;
  delete userObj.verificationToken;

  return {
    userObj,
    accessToken,
    refreshToken,
  };
};

const logout = async (userId) => {
  if (!userId) throw ApiError.unAuthorized("No user ID present");
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  return;
};

const refresh = async (token) => {
  /**
   ** Is token there or not
   ** decode the incoming refresh token and get id from there ... to look up in DB
   ** compare refreshToken to the DB
   ** generate new Access token and Refresh Token
   ** save the new one to DB and send user a new access and refresh token
   */

  if (!token) throw ApiError.unAuthorized("No refresh token present");

  const decoded = verifyRefreshToken(token); // I can get id from this
  if (!decoded) throw ApiError.unAuthorized("Invalid or expired refresh token");

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) throw ApiError.unAuthorized("User not found for refresh Token");

  const hashedRefreshToken = hashToken(token);

  if (hashedRefreshToken !== user.refreshToken)
    throw ApiError.unAuthorized("Refresh Token does not match");

  const refreshToken = generateRefreshToken({ id: user._id });
  const accessToken = generateAccessToken({ id: user._id, role: user.role });

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.refreshToken;

  return {
    userObj,
    accessToken,
    refreshToken,
  };
};

const forgotPassword = async (email) => {
  /**
   * Check if email was sent
   * generate a token send it to user and save hashed one in db
   * check if token sent by user matches the one in DB
   * if matches replace old password with the new password
   */

  if (!email) throw ApiError.unAuthorized("Email not found");

  const { rawToken, hashedToken } = generateResetToken();

  const user = await User.findOne({ email }).select("+resetPasswordToken");
  if (!user) throw ApiError.notFound("User not found");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;

  user.save({ validateBeforeSave: false });
};
// TODO: Reset password

export { register, login, refresh, logout, forgotPassword };
