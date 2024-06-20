import Appointment from "../models/appointmentModel.js";
import Vehicle from "../models/VehicleModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import History from "../models/historyModel.js";

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const { vin, date, type, location, time } = req.body;
  const userId = req.user._id;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find the vehicle by VIN
  const vehicle = await Vehicle.findOne({ vin: vin });

  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  const existingAppointment = await Appointment.findOne({
    user: userId,
    vin: vin,
  });

  if (existingAppointment) {
    res.status(400);
    throw new Error("An appointment for this vehicle already exists");
  }

  // Create a new appointment
  const appointment = new Appointment({
    user: user._id,
    vin: vin,
    date,
    type,
    location,
    time,
  });

  const createdAppointment = await appointment.save();

  res.status(201).json(createdAppointment);
});

// @desc    Get appointments for a user
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { vin } = req.params;

  const appointment = await Appointment.findOne({ user: userId, vin: vin });

  if (!appointment) {
    res.status(404);
    throw new Error("No appointments found");
  }

  res.json(appointment);
});

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find().populate("user");

  if (!appointments || appointments.length === 0) {
    res.status(404);
    throw new Error("No appointments found");
  }

  // Fetch vehicle details for each appointment
  const appointmentsWithVehicleDetails = await Promise.all(
    appointments.map(async (appointment) => {
      const vehicle = await Vehicle.findOne({ vin: appointment.vin });
      return { ...appointment.toObject(), vehicle };
    })
  );

  res.json(appointmentsWithVehicleDetails);
});

// @desc    Get all appointments for a specific date
// @route   GET /api/appointments/date/:date
// @access  Private
const getAppointmentsByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) {
    res.status(400);
    throw new Error("Invalid date format");
  }

  const startOfDay = new Date(parsedDate);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(parsedDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  try {
    const appointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("user"); // Removed .populate("vehicle")

    if (!appointments || appointments.length === 0) {
      res.status(404);
      throw new Error("No appointments found for this date");
    }

    // Fetch vehicle details for each appointment
    const appointmentsWithVehicleDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const vehicle = await Vehicle.findOne({ vin: appointment.vin });
        return { ...appointment.toObject(), vehicle };
      })
    );

    res.json(appointmentsWithVehicleDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  appointment.status = status;
  await appointment.save();

  res.json(appointment);
});

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const appointmentId = req.params.id;

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    user: userId,
  });

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  await Appointment.deleteOne({ _id: appointmentId, user: userId });
  res.json({ message: "Appointment cancelled" });
});

// @desc    Delete an appointment by admin
// @route   DELETE /api/appointments/admin/:id
// @access  Private (admin)
const deleteAppointmentByAdmin = asyncHandler(async (req, res) => {
  const appointmentId = req.params.id;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  await Appointment.deleteOne({ _id: appointmentId });
  res.json({ message: "Appointment cancelled by admin" });
});

// @desc    Update appointment isPaid status and generate history
// @route   PATCH /api/appointments/:id/paid
// @access  Private
const updateAppointmentIsPaid = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id).populate("user");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (appointment.isPaid) {
    res.status(400);
    throw new Error("Appointment is already paid");
  }

  appointment.isPaid = true;
  await appointment.save();

  const vehicle = await Vehicle.findOne({ vin: appointment.vin });

  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  const history = new History({
    user: appointment.user._id,
    vehicle: vehicle._id,
    serviceCenter: appointment.location,
    date: appointment.date,
    type: appointment.type,
  });

  await history.save();

  res.json({ appointment, history });
});

// @desc    Assign mechanic to an appointment
// @route   PATCH /api/appointments/:id/assign
// @access  Private
const assignMechanicToAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { mechanicId } = req.body;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  appointment.assignedTo = mechanicId;
  await appointment.save();

  res.json(appointment);
});

// @desc    Get appointments assigned to a mechanic
// @route   GET /api/appointments/mechanic/:mechanicId
// @access  Private
const getAssignedAppointments = asyncHandler(async (req, res) => {
  const { mechanicId } = req.params;
  const appointments = await Appointment.find({
    assignedTo: mechanicId,
  }).populate("user");

  if (!appointments || appointments.length === 0) {
    res.status(404);
    throw new Error("No appointments found for this mechanic");
  }

  // Fetch vehicle details for each appointment
  const appointmentsWithVehicleDetails = await Promise.all(
    appointments.map(async (appointment) => {
      const vehicle = await Vehicle.findOne({ vin: appointment.vin });
      return { ...appointment.toObject(), vehicle };
    })
  );

  res.json(appointmentsWithVehicleDetails);
});

export {
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
};
