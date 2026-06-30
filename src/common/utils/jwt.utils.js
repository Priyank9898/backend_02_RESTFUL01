import crypto from "crypto";
import jwt from "jsonwebtoken";

//! How JWT token is created
/**
   * *  Here payload + secret gives SIGNATURE
e.x
Header
   +
Payload = {
             userId: 123,
             role: "CUSTOMER"
          }
   +
JWT Secret
   |
   v
Signature Generated
JWT Token = Header.Payload.Signature

* * Signature ka purpose
Signature is the security part of the JWT

It is used to verify that:
1. The token was created by the server.
2. The token has not been modified/tampered with.
*/

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    return null;
  }
};

////////////////////////////////////////////////////

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return null;
  }
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
