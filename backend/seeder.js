import dotenv from "dotenv";
import users from "./data/users.js";
import colors from "colors";
import User from "./models/userModel.js";
import connectDB from "./config/db.js";
import Vehicle from "./models/VehicleModel.js";
import vehicles from "./data/vehicle.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(users);

    await Vehicle.deleteMany();
    await Vehicle.insertMany(vehicles);

    console.log("Data Imported".green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Vehicle.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "d") {
  destroyData();
} else {
  importData();
}
