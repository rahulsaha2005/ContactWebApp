import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";

import UserRoute from "./routes/user.route.js";
import FriendRoute from "./routes/friend.route.js";

// Load env variables
dotenv.config();

const app = express();

// Connect to MongoDB immediately
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS: allow local and deployed frontend
const corsOptions = {
  origin: process.env.PORT || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/user/friend", FriendRoute);

// Export app for Vercel serverless
export default app;

// Only listen locally
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
