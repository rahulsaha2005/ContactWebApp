// app.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";

import UserRoute from "./routes/user.route.js";
import FriendRoute from "./routes/friend.route.js";

// Load environment variables from .env
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS: allow local dev and deployed frontend
const allowedOrigins = [
  "http://localhost:5173",                  // local frontend
  "https://contactwebapp-6.onrender.com"   // deployed frontend
];

const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/user/friend", FriendRoute);

// Export app for serverless platforms (Vercel)
export default app;

// Only listen if running locally or on Render
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
