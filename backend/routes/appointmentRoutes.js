import express from "express";
import {
  createAppointment,
  getAppointments,
  deleteAppointment,
  getAppointmentsByDate,
  updateAppointmentStatus,
  deleteAppointmentByAdmin,
  getAllAppointments,
  updateAppointmentIsPaid,
  assignMechanicToAppointment,
  getAssignedAppointments,
} from "../controllers/appointmentControllers.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const appointmentRoutes = express.Router();

appointmentRoutes
  .route("/")
  .post(protect, createAppointment)
  .get(protect, admin, getAllAppointments);
appointmentRoutes.route("/:vin").get(protect, getAppointments);
appointmentRoutes.route("/:id").delete(protect, deleteAppointment);
appointmentRoutes.route("/date/:date").get(protect, getAppointmentsByDate);
appointmentRoutes.route("/:id/status").patch(protect, updateAppointmentStatus);
appointmentRoutes.route("/:id/paid").patch(protect, updateAppointmentIsPaid);
appointmentRoutes
  .route("/admin/:id")
  .delete(protect, admin, deleteAppointmentByAdmin);
appointmentRoutes
  .route("/:id/assign")
  .patch(protect, assignMechanicToAppointment);
appointmentRoutes
  .route("/mechanic/:mechanicId")
  .get(protect, getAssignedAppointments);

export default appointmentRoutes;
