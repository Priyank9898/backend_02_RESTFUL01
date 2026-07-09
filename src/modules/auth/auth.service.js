import {
  sendResetPasswordMail,
  sendVerificationMail,
} from "../../common/config/email.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";
import crypto from "crypto";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

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

  // TODO: Implement email verification
  // try {
  //   await sendVerificationMail(email, rawToken);
  // } catch (err) {
  //   await user.deleteOne(); // rollback if email send error
  //   throw ApiError.internal(
  //     "Unable to send verification email.PLease try again later,",
  //   );
  // }

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.verificationToken;

  return {
    userObj,
    verificationToken: rawToken,
  };
};

const verifyEmail = async (token) => {
  if (!token) throw ApiError.badRequest("No token present");

  const hashedToken = hashToken(token);

  const user = await User.findOne({ verificationToken: hashedToken }).select(
    "+verificationToken",
  );
  if (!user) throw ApiError.badRequest("Invalid Verification Token");

  user.isVerified = true;
  user.verificationToken = undefined;

  await user.save({ validateBeforeSave: false });

  return user;
};

const login = async ({ email, password }) => {
  if (!email || !password)
    throw ApiError.badRequest("Kindly enter email and password");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const isMatchPassword = await user.comparePassword(password);
  if (!isMatchPassword)
    throw ApiError.unauthorized("Invalid email or password");

  // TODO : After email verification is implemented then uncomment this line to check if user is verified or not
  // if (!user.isVerified) throw ApiError.unAuthorized("Please verify your email");

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;
  delete userObj.verificationToken;

  return {
    user: userObj,
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

const forgotPassword = async ({ email }) => {
  /**
   * Check if email exist?
   * Generate reset token
   * Save hash token and expiry in DB
   * Send raw token to user's email
   */

  if (!email) throw ApiError.badRequest("Email not found");

  const user = await User.findOne({ email })
    .select("+resetPasswordToken")
    .select("+resetPasswordExpires");
  if (!user) throw ApiError.notFound("user not found");

  const { rawToken, hashedToken } = generateResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; //5 minutes

  await user.save({ validateBeforeSave: false });

  // TODO: email implementation will be done later on
  // await sendResetPasswordMail(email, rawToken);

  // TODO: Remove rawToken from response after email integration.
  return { rawToken };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return user;
};

const resetPassword = async (token, password) => {
  if (!token) throw ApiError.badRequest("Reset token is missing");
  if (!password) throw ApiError.badRequest("Password is missing");

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .select("+resetPasswordToken")
    .select("+resetPasswordExpires");

  if (!user) throw ApiError.badRequest("Invalid or expired reset token");

  user.password = password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};

export {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  getMe,
  verifyEmail,
  resetPassword,
};
