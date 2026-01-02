import express from "express";
import {
  register,
  login,
  updateProfile,
  logout,
} from "../controller/user.controller.js";
import { isAuthenicated } from "../middlewares/isAuthenicated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", isAuthenicated, logout);
router.put("/profile", singleUpload, isAuthenicated, updateProfile);

export default router;
