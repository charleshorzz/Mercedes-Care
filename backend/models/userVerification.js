import mongoose from "mongoose";

const UserVerificationSchema = new mongoose.Schema({
  userId: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

const Userverification = mongoose.model(
  "UserVerification",
  UserVerificationSchema
);

export default Userverification;
