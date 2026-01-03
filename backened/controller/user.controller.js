import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Helper to format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// -------------------- REGISTER NEW USER --------------------
export const register = async (req, res) => {
  try {
    const { fullname, username, email, phoneNumber, password } = req.body;

    if (!fullname || !username || !email || !phoneNumber || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "User with this email already exists",
        success: false,
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken",
        success: false,
      });
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      return res.status(400).json({
        message: "Username can only contain letters, numbers, and underscores",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      username: username.toLowerCase(),
      email,
      phoneNumber,
      password: hashedPassword,
      profile: "",
    });

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "profile_images",
      });
      if (cloudResponse) {
        user.profile = cloudResponse.secure_url;
        await user.save();
      }
    }

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profile: user.profile,
        joinedAt: formatDate(user.joinedAt),
      },
    });
  } catch (error) {
    console.log("Register error:", error);
    return res.status(500).json({
      message: "Internal server error - register",
      success: false,
    });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        success: true,
        user: {
          _id: user._id,
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          friends: user.friends,
          profile: user.profile,
          joinedAt: formatDate(user.joinedAt),
        },
      });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({
      message: "Internal server error - login",
      success: false,
    });
  }
};

// -------------------- LOGOUT --------------------
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error - logout",
      success: false,
    });
  }
};

// -------------------- UPDATE PROFILE --------------------
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, username } = req.body;
    const userId = req.id; // from auth middleware

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    if (username) {
      const usernameExists = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (usernameExists) {
        return res
          .status(400)
          .json({ message: "Username already taken", success: false });
      }
      if (!/^[a-z0-9_]+$/.test(username)) {
        return res.status(400).json({
          message:
            "Username can only contain letters, numbers, and underscores",
          success: false,
        });
      }
      user.username = username.toLowerCase();
    }

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "profile_images",
      });
      if (cloudResponse) {
        user.profile = cloudResponse.secure_url;
      }
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profile: user.profile,
        joinedAt: formatDate(user.joinedAt),
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Internal server error - update profile",
      success: false,
    });
  }
};
