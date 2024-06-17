import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vin: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    carPlate: {
      type: String,
    },
    nextServiceDate: {
      type: String,
    },
    nextServiceRange: {
      type: String,
    },
    image: {
      type: String,
    },
    premium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
