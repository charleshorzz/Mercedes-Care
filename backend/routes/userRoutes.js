import express from "express";
const userRoutes = express.Router();
import {
  authUser,
  registerUser,
  logOutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserByID,
  deleteUser,
  updateUser,
  verifyUser,
  sendRecoveryEmailUser,
  updatePasswordUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import path from "path";

userRoutes.route("/").post(registerUser).get(protect, admin, getUsers);
userRoutes.post("/logout", logOutUser);
userRoutes.post("/login", authUser);
userRoutes
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
userRoutes
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, getUserByID)
  .put(protect, admin, updateUser);
userRoutes.post("/verify", verifyUser);
userRoutes.post("/sendMail", sendRecoveryEmailUser);
userRoutes.post("/updatepw", updatePasswordUser);

export default userRoutes;
