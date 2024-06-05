import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());

//Body-parser for data to be passed into server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser, allow us to access cookie, jwt
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
