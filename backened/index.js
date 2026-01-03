import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import path from "path";

import UserRoute from "./routes/user.route.js";
import FriendRoute from "./routes/friend.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(cors({
  origin: true,
  credentials: true,
}));

// API routes
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/user/friend", FriendRoute);

// Serve frontend
const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "frontened", "dist");

app.use(express.static(frontendPath));

// ✅ SPA fallback — EXPRESS 5 SAFE
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running at port ${PORT}`);
});
