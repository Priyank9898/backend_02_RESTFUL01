import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
};

// const verifyAccessToken = (token) => {
//   try {
//     return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//   } catch (err) {
//     return null;
//   }
// };

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

////////////////////////////////////////////////////

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

// const verifyRefreshToken = (token) => {
//   try {
//     return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//   } catch (err) {
//     return null;
//   }
// };

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

////////////////////////////////////////////////////

const generateResetToken = () => {
  // 32 = bytes  and converting from hex value
  const rawToken = crypto.randomBytes(32).toString("hex");
  // This token can also be hashed
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return { rawToken, hashedToken };
};

export {
  generateResetToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
