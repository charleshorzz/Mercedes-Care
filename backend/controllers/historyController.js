import asyncHandler from "../middleware/asyncHandler.js";
import History from "../models/historyModel.js";

// @desc Get service history by user ID
// @route GET /api/history/user/:id
// @access Private
const getServiceHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const histories = await History.find({ user: id }).populate("vehicle");

  if (!histories) {
    res.status(404);
    throw new Error("No service history found");
  }

  res.json(histories);
});

// @desc Get service history by vehicle ID
// @route GET /api/history/vehicle/:vehicleId
// @access Private
const getServiceHistoryByVehicle = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;

  const histories = await History.find({ vehicle: vehicleId }).populate(
    "vehicle"
  );

  if (!histories) {
    res.status(404);
    throw new Error("No service history found");
  }

  res.json(histories);
});

export { getServiceHistory, getServiceHistoryByVehicle };
