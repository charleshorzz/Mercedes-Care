import express from "express";
const historyRoutes = express.Router();
import {
  getServiceHistory,
  getServiceHistoryByVehicle,
} from "../controllers/historyController.js";
import { protect } from "../middleware/authMiddleware.js";

historyRoutes.route("/user/:id").get(protect, getServiceHistory);
historyRoutes
  .route("/vehicle/:vehicleId")
  .get(protect, getServiceHistoryByVehicle);

export default historyRoutes;
