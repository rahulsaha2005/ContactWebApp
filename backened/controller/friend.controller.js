import User from "../models/user.js";

// Add friend
export const addFriend = async (req, res) => {
  try {
    const userId = req.id; // from auth middleware
    const { friendName, friendEmail, friendPhone, Message } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if friend already exists
    const exists = user.friends.some(
      (f) => f.friendEmail === friendEmail && f.friendPhone === friendPhone
    );

    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Friend already added" });
    }

    // Add new friend
    user.friends.push({
      friendName,
      friendEmail,
      friendPhone,
      Message: Message || "",
    });

    // Save updated user
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Friend added successfully",
      user: updatedUser, // send full user object
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete friend
export const deleteFriend = async (req, res) => {
  try {
    const userId = req.id; // from auth middleware
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
      user: updatedUser, // send full user object
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update friend
export const updateFriend = async (req, res) => {
  try {
    const userId = req.id; // from auth middleware
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

    // Update fields
    if (friendName) user.friends[friendIndex].friendName = friendName;
    if (newEmail) user.friends[friendIndex].friendEmail = newEmail;
    if (newPhone) user.friends[friendIndex].friendPhone = newPhone;
    if (Message) user.friends[friendIndex].Message = Message;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Friend updated successfully",
      user: updatedUser, // send full user object
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
