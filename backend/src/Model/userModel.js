import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    forgot_password_otp: {
      type: String,
      default: null,
    },
    forgot_password_expiry: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    refresh_token: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isstatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      profilephoto: { type: String },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
