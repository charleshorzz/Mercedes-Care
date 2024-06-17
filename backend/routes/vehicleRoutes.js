import express from "express";
import Vehicle from "../models/VehicleModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  getVehicleByVIN,
  addVehicle,
  deleteVehicle,
  getVehiclesByVINs,
  getAllVehicles,
  addVehicleAdmin,
  deleteVehicleAdmin,
  getVehicleByVinAdmin,
} from "../controllers/vehicleController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const vehicleRoutes = express.Router();

vehicleRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const vehicles = await Vehicle.find({});
    res.status(200).json(vehicles);
  })
);
vehicleRoutes
  .route("/")
  .post(protect, addVehicle)
  .get(protect, admin, getAllVehicles);
vehicleRoutes.route("/:vin").delete(protect, deleteVehicle);
vehicleRoutes.route("/details").post(getVehiclesByVINs);
vehicleRoutes.route("/admin").post(protect, addVehicleAdmin);
vehicleRoutes
  .route("/admin/:vin")
  .get(protect, getVehicleByVinAdmin)
  .delete(protect, deleteVehicleAdmin);

export default vehicleRoutes;
