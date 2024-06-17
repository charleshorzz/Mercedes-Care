import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

//Body-parser for data to be passed into server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser, allow us to access cookie, jwt
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/history", historyRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
