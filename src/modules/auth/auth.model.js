import { Schema, model } from "mongoose";
import { ROLES } from "../../common/constants/roles.js";

// Cerated Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },

    password: {
      // Will discuss more about password letter regarding hashing and encryption
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      maxlength: 20,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    //! select : false --> Makes sure that it does not get returned
    verificationToken: {
      type: String,
      select: false,
    },

    refreshToken: {
      type: String,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
    versionKey: false, // __v field will not be created in DB
  },
);

export default model("User", userSchema);
