import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";

import UserRoute from "./routes/user.route.js";
import FriendRoute from "./routes/friend.route.js";

const app = express();
dotenv.config({});

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/v1/user", UserRoute);
app.use("/api/v1/user/friend", FriendRoute);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`server running at port ${process.env.PORT}`);
});
