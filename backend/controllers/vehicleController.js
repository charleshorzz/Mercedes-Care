import Vehicle from "../models/VehicleModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Helper function to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the assets directory exists
const assetsDir = path.join(
  __dirname,
  "../../react-tailwind-sidebar/src/assets"
);
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: assetsDir,
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only!"));
  }
}

// @desc Get vehicle by vin
// @route GET /api/users/vehicles
// @access Private
const getVehicleByVIN = asyncHandler(async (req, res) => {
  const { vin } = req.params;

  try {
    const vehicle = await Vehicle.findOne({ vin }).populate("user", "email");
    if (vehicle) {
      res.status(200).json(vehicle);
    } else {
      res.status(404);
      throw new Error("Vehicle not found");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Server error");
  }
});

// @desc Get vehicles by multiple VINs
// @route POST /api/vehicles/details
// @access Private
const getVehiclesByVINs = asyncHandler(async (req, res) => {
  const { vins } = req.body;

  try {
    const vehicles = await Vehicle.find({ vin: { $in: vins } });
    if (vehicles.length) {
      res.status(200).json(vehicles);
    } else {
      res.status(404);
      throw new Error("No vehicles found");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Server error");
  }
});

// @desc Add vehicle to user
// @route POST /api/vehicles
// @access Private
const addVehicle = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming user is authenticated and userId is available in req.user
  const { vin } = req.body;

  const vehicle = await Vehicle.findOne({ vin });

  if (!vehicle) {
    res.status(400);
    throw new Error("The VIN input is invalid");
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if the vehicle already exists for the user
  const vehicleExists = user.vehicles.some((v) => v.vin === vin);

  if (vehicleExists) {
    res.status(400);
    throw new Error("Vehicle already exists");
  }

  user.vehicles.push({ vin });
  await user.save();

  res.status(201).json({
    message: "Vehicle added successfully",
    user: user,
  });
});

// @desc Delete vehicle from user
// @route DELETE /api/users/vehicles/:vin
// @access Private
const deleteVehicle = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming user is authenticated and userId is available in req.user
  const { vin } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if user has only one vehicle
  if (user.vehicles.length === 1) {
    res.status(400);
    throw new Error("Cannot delete the only vehicle");
  }

  const vehicleIndex = user.vehicles.findIndex((v) => v.vin === vin);

  if (vehicleIndex === -1) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  user.vehicles.splice(vehicleIndex, 1);
  await user.save();

  res.status(200).json({
    message: "Vehicle deleted successfully",
    user: user,
  });
});

// @desc Get all vehicles
// @route GET /api/vehicles
// @access Private (admin)
const getAllVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find();

  if (!vehicles || vehicles.length === 0) {
    res.status(404);
    throw new Error("No vehicles found");
  }

  res.json(vehicles);
});

// @desc Add a new vehicle
// @route POST /api/vehicles/admin
// @access Private (admin)
const addVehicleAdmin = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        res.status(400).json({ message: err.message });
      } else if (err.message === "Error: Images Only!") {
        // File type error
        res.status(400).json({ message: err.message });
      } else {
        // Other errors
        res.status(500).json({ message: "Server error" });
      }
    } else {
      const {
        vin,
        name,
        carPlate,
        nextServiceDate,
        nextServiceRange,
        premium,
      } = req.body;

      if (!req.file) {
        res.status(400).json({ message: "Please upload an image" });
        return;
      }

      const image = `/src/assets/${req.file.filename}`;

      const vehicleExists = await Vehicle.findOne({ vin });

      if (vehicleExists) {
        res.status(400).json({ message: "Vehicle already exists" });
        return;
      }

      const vehicle = new Vehicle({
        vin,
        name,
        carPlate,
        nextServiceDate,
        nextServiceRange,
        image,
        premium,
      });

      const createdVehicle = await vehicle.save();

      res.status(201).json(createdVehicle);
    }
  });
});

// @desc Get vehicle by vin for admin
// @route GET /api/vehicles/admin/:vin
// @access Private (admin)
const getVehicleByVinAdmin = asyncHandler(async (req, res) => {
  const { vin } = req.params;

  try {
    const vehicle = await Vehicle.findOne({ vin });
    if (vehicle) {
      res.status(200).json(vehicle);
    } else {
      res.status(404);
      throw new Error("Vehicle not found");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Server error");
  }
});

// @desc Delete a vehicle
// @route DELETE /api/vehicles/admin/:vin
// @access Private (admin)
const deleteVehicleAdmin = asyncHandler(async (req, res) => {
  const { vin } = req.params;

  const vehicle = await Vehicle.findOneAndDelete({ vin });

  if (!vehicle) {
    res.status(404).throw(new Error("Vehicle not found"));
  }

  res.json({ message: "Vehicle deleted successfully" });
});

export {
  getVehicleByVIN,
  addVehicle,
  deleteVehicle,
  getVehiclesByVINs,
  deleteVehicleAdmin,
  addVehicleAdmin,
  getAllVehicles,
  getVehicleByVinAdmin,
};
