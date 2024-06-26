import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const vehicleSchema = mongoose.Schema({
  vin: {
    type: String,
    required: true,
    ref: "Vehicle",
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isMechanic: {
      type: Boolean,
      required: true,
      default: false,
    },
    location: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    vehicles: [vehicleSchema],
  },
  {
    timestamps: true,
  }
);

//Password validation

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
