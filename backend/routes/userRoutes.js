import express from "express";
const userRoutes = express.Router();
import {
  authUser,
  registerUser,
  logOutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserByName,
  deleteUser,
  updateUser,
  verifyUser,
  sendRecoveryEmailUser,
  updatePasswordUser,
  getMechanics,
  addMechanic,
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
  .put(protect, updateUser);
userRoutes
  .route("/mecha")
  .get(protect, admin, getMechanics)
  .post(protect, admin, addMechanic);
userRoutes.post("/verify", verifyUser);
userRoutes.post("/sendMail", sendRecoveryEmailUser);
userRoutes.post("/updatepw", updatePasswordUser);
userRoutes.route("/:username").get(protect, admin, getUserByName);

export default userRoutes;
