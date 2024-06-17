import express from "express";
const feedbackRoutes = express.Router();
import {
  createFeedback,
  getAllFeedbacks,
  replyFeedback,
} from "../controllers/feedbackController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

feedbackRoutes
  .route("/")
  .post(protect, createFeedback)
  .get(protect, admin, getAllFeedbacks);
feedbackRoutes.route("/reply").post(protect, replyFeedback);

export default feedbackRoutes;
