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
  // This service can directly talk with the database and perform the necessary operations
  const existingUser = await User.findOne({ email: email });
  if (existingUser)
    throw ApiError.conflict("User with this email already exist");

  const { rawToken, hashedToken } = generateResetToken();

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: hashedToken,
  });

  // TODO : send an email to user with token: rawToken

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;

  return userObj;
};

const login = async ({ email, password }) => {
  //    * Check if user's email exist or not
  //    * Check for the hashed password if it matches with the password in the database
  //    * Check if user is verified or not
  //    * Return access token and refresh token
  //    * Send the refresh token to the database

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.badRequest("Invalid email or password");
  if (!user.isVerified) throw ApiError.unAuthorized("Kindly verify email");

  // generating access and refresh token
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  //need to save refreshToken in DB
  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  //TODO Send cookie to the client

  return {
    userObj,
    refreshToken,
    accessToken,
  };
};

const refresh = async (token) => {
  if (!token) throw ApiError.unAuthorized("Refresh token missing");

  const decoded = verifyRefreshToken(token);
  if (!decoded) throw ApiError.unAuthorized("Invalid refresh token");

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) throw ApiError.unAuthorized("User not found");

  const hashedToken = hashToken(token);

  if (user.refreshToken !== hashedToken) {
    throw ApiError.unAuthorized("Refresh token does not match");
  }

  const refreshToken = generateRefreshToken({ id: user._id });
  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

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

const logout = async (userId) => {
  if (!userId) throw ApiError.unAuthorized("No userId present");
  await User.findByIdAndUpdate(userId, { refreshToken });
};

export { register, login, refresh, logout };
