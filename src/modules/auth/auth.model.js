import { Schema, model } from "mongoose";
import { ROLES } from "../../common/constants/roles.js";
import bcrypt from "bcryptjs";

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

userSchema.pre("save", async function (next) {
  //* If password is not modified then no need to hash the password again
  if (!this.isModified(this.password)) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

export default model("User", userSchema);
