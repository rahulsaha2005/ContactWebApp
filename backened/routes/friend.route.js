import express from "express";
import {
  addFriend,
  deleteFriend,
  updateFriend,
} from "../controller/friend.controller.js";
import { isAuthenicated } from "../middlewares/isAuthenicated.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();
router.post("/add", singleUpload, isAuthenicated, addFriend);
router.put("/update", singleUpload, isAuthenicated, updateFriend);
router.delete("/delete", isAuthenicated, deleteFriend);
export default router;
