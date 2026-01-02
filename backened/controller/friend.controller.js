import User from "../models/user.js";

// Add friend
export const addFriend = async (req, res) => {
  try {
    const userId = req.id; // from isAuth middleware
    const { friendName, friendEmail, friendPhone, Message } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, Message: "User not found" });

    const exists = user.friends.some(
      (f) => f.friendEmail === friendEmail && f.friendPhone === friendPhone
    );

    if (exists)
      return res
        .status(400)
        .json({ success: false, Message: "Friend already added" });

    user.friends.push({
      friendName,
      friendEmail,
      friendPhone,
      Message: Message || "",
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Friend added successfully",
      friends: user.friends,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, Message: "Server error" });
  }
};

// Delete friend
export const deleteFriend = async (req, res) => {
  try {
    const userId = req.id; // from isAuth middleware
    const { friendEmail, friendPhone } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, Message: "User not found" });

    const newFriends = user.friends.filter(
      (f) => !(f.friendEmail === friendEmail && f.friendPhone === friendPhone)
    );

    if (newFriends.length === user.friends.length)
      return res
        .status(404)
        .json({ success: false, Message: "Friend not found" });

    user.friends = newFriends;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Friend deleted",
      friends: user.friends,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, Message: "Server error" });
  }
};

// Update friend
export const updateFriend = async (req, res) => {
  try {
    const userId = req.id; // from isAuth middleware
    const { friendEmail, friendPhone, newEmail, newPhone, Message } = req.body;

    if (!friendEmail || !friendPhone) {
      return res
        .status(400)
        .json({ success: false, Message: "Friend identifier missing" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, Message: "User not found" });
    }

    const friendIndex = user.friends.findIndex(
      (f) => f.friendEmail === friendEmail && f.friendPhone === friendPhone
    );

    if (friendIndex === -1) {
      return res
        .status(404)
        .json({ success: false, Message: "Friend not found" });
    }

    if (newEmail) user.friends[friendIndex].friendEmail = newEmail;
    if (newPhone) user.friends[friendIndex].friendPhone = newPhone;
    if (Message) user.friends[friendIndex].Message = Message;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Friend updated",
      friends: user.friends,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, Message: "Server error" });
  }
};
