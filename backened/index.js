import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";

import UserRoute from "./routes/user.route.js";
import FriendRoute from "./routes/friend.route.js";

const app = express();
dotenv.config({});

// make data availabe in request.body
app.use(express.json());

//parses form data
app.use(
  express.urlencoded({
    // allow nested objects
    extended: true,
  })
);

//read cookies from browser and store them in req.bodies
app.use(cookieParser());

const corsOptions = {
  // fronted at these port react vue
  origin: "http://localhost:5173",
  // allow jwt,sessions
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/v1/user", UserRoute);
app.use("/api/v1/user/friend", FriendRoute);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`server running at port ${process.env.PORT}`);
});
