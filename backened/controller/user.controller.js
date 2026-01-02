import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// register new user
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password } = req.body;

    if (!fullname || !email || !phoneNumber || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
        success: false,
      });
    }

    // hashing password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // successfully make user in mongonse
    const user = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      profile: {},
    });

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
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
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.log("Register error:", error);
    return res.status(500).json({
      message: "Internal server error-register",
      success: false,
    });
  }
};
// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    // compare password to check is password match
    const checker = await bcrypt.compare(password, user.password);
    if (!checker) {
      return res.status(400).json({
        message: "Password is wrong",
        success: false,
      });
    }
    // cookies for future perspective so that again again no need to search in db
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
          email: user.email,
          phoneNumber: user.phoneNumber,
          friends: user.friends,
        },
      });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({
      message: "Internal server error- login ",
      success: false,
    });
  }
};
//logout
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
// update profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber } = req.body;
    const userId = req.id; // from middleware auth

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
