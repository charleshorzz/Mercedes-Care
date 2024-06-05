import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import Userverification from "../models/userVerification.js";

const sendOTPVerificationEmail = async ({ _id, email }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `
        <p>
          Enter <b>${otp}</b> in the MERCEDES-CARE to verify your email address 
        </p>
        <p>This link <b>expires in 1 hour</b></p>
        `,
    };

    // Hashing otp
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    const newOTPVerification = new Userverification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    // Save OTP record
    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);

    return {
      status: "PENDING",
      message: "Verification OTP email sent",
      data: {
        userId: _id,
        email,
      },
    };
  } catch (error) {
    return {
      status: "FAILED",
      message: error.message,
    };
  }
};

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Set web token as HTTP cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } else {
    if (user && !user.verified) {
      res.status(401);
      throw new Error("Email hasn't been verified yet. Check your inbox");
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  }
});

// @desc Register user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  if (user) {
    const otpResponse = await sendOTPVerificationEmail(user);
    if (otpResponse.status === "PENDING") {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    } else {
      res.status(500).json({
        message: otpResponse.message,
      });
    }
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Send email to user for password recover
// route POST /api/users/sendEmail
// @access Public

const sendRecoveryEmailUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email: email });

  if (user) {
    const otpResponse = await sendOTPVerificationEmail(user);
    if (otpResponse.status === "PENDING") {
      res.status(201).json({
        _id: user._id,
        email: user.email,
      });
    } else {
      res.status(500).json({
        message: otpResponse.message,
      });
    }
  } else {
    res.status(400);
    throw new Error("User did not exists");
  }
});

// @desc Update user password
// @route POST /api/users/updatepw
// @access Public
const updatePasswordUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user) {
    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.status(201).json({
      _id: updatedUser._id,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  try {
    let { userId, otpValue } = req.body;
    if (!userId || !otpValue) {
      res.status(400).json({
        status: "FAILED",
        message: "Empty otp details are not allowed",
      });
    } else {
      const UserOTPVerificationRecords = await Userverification.find({
        userId,
      });
      if (UserOTPVerificationRecords.length <= 0) {
        res.status(404).json({
          status: "FAILED",
          message: "Account record doesn't exist or has been verified",
        });
      } else {
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
          await Userverification.deleteMany({ userId });
          res.status(400).json({
            status: "FAILED",
            message: "Code has expired. Please request again",
          });
        } else {
          const validOTP = await bcrypt.compare(otpValue, hashedOTP);

          if (!validOTP) {
            res.status(400).json({
              status: "FAILED",
              message: "Invalid code passed, check again your mailbox",
            });
          } else {
            await User.updateOne({ _id: userId }, { verified: true });
            await Userverification.deleteMany({ userId });
            res.status(200).json({
              status: "VERIFIED",
              message: "User email verified successfully",
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// @desc Logout user / clear cookie
// @route POST /api/users/logout
// @access Private
const logOutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expiresIn: new Date(0),
  });

  res.status(200).json({ message: "Logged Out Successfully" });
});

// @desc Get user Profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user Profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// @desc Get users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  res.send("get users");
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send("get users");
});

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserByID = asyncHandler(async (req, res) => {
  res.send("get user by id");
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  res.send("update user");
});

export {
  authUser,
  registerUser,
  logOutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserByID,
  deleteUser,
  updateUser,
  verifyUser,
  sendRecoveryEmailUser,
  updatePasswordUser,
};
