import User from "../models/user.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const addFriend = async (req, res) => {
  try {
    // console.log(req);
    const userId = req.id;
    const { friendName, friendEmail, friendPhone, Message } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const exists = user.friends.some(
      (f) => f.friendEmail === friendEmail && f.friendPhone === friendPhone
    );

    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Friend already added" });
    }
    let image = "";

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "profile_images",
      });
      if (cloudResponse) {
        image = cloudResponse.secure_url;
      }
    }

    user.friends.push({
      friendName,
      friendEmail,
      friendPhone,
      Message: Message || "",
      friendPhoto: image,
    });

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Friend added successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteFriend = async (req, res) => {
  try {
    const userId = req.id;
    const { friendEmail, friendPhone } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const newFriends = user.friends.filter(
      (f) => !(f.friendEmail === friendEmail && f.friendPhone === friendPhone)
    );

    if (newFriends.length === user.friends.length)
      return res
        .status(404)
        .json({ success: false, message: "Friend not found" });

    user.friends = newFriends;
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Friend deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateFriend = async (req, res) => {
  try {
    const userId = req.id;
    const {
      friendEmail,
      friendPhone,
      friendName,
      newEmail,
      newPhone,
      Message,
    } = req.body;

    if (!friendEmail || !friendPhone) {
      return res
        .status(400)
        .json({ success: false, message: "Friend identifier missing" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const friendIndex = user.friends.findIndex(
      (f) => f.friendEmail === friendEmail && f.friendPhone === friendPhone
    );

    if (friendIndex === -1)
      return res
        .status(404)
        .json({ success: false, message: "Friend not found" });

    if (friendName) user.friends[friendIndex].friendName = friendName;
    if (newEmail) user.friends[friendIndex].friendEmail = newEmail;
    if (newPhone) user.friends[friendIndex].friendPhone = newPhone;
    if (Message) user.friends[friendIndex].Message = Message;
    let image = "";

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "profile_images",
      });
      if (cloudResponse) {
        image = cloudResponse.secure_url;
      }
    }
    if (image) user.friends[friendIndex].friendPhoto = image;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Friend updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
