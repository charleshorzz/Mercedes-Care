import asyncHandler from "../middleware/asyncHandler.js";
import Feedback from "../models/feedbackModel.js";
import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, content }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject,
    html: `
      <p>${content}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      status: "SUCCESS",
      message: "Email sent successfully",
    };
  } catch (error) {
    return {
      status: "FAILED",
      message: error.message,
    };
  }
};

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
const createFeedback = asyncHandler(async (req, res) => {
  const { subject, content, selectedEmoji } = req.body;
  const userId = req.user._id;

  // Check if user has already submitted feedback today
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of the day

  const existingFeedback = await Feedback.findOne({
    user: userId,
    date: { $gte: today },
  });

  if (existingFeedback) {
    res.status(400);
    throw new Error("You have already submitted feedback today");
  }

  const feedback = new Feedback({
    user: userId,
    subject,
    content,
    selectedEmoji,
  });

  const createdFeedback = await feedback.save();

  // Send email notification
  const emailResult = await sendEmail({
    email: req.user.email,
    subject: "We have received your feedback",
    content: `
    <p>
      Thank you for your feedback on <span>Mercedes-Care</span>. We will get back to you ASAP.
    </p>
  `,
  });

  res.status(201).json({
    feedback: createdFeedback,
    emailResult,
  });
});

// @desc    Fetch all feedbacks
// @route   GET /api/feedback
// @access  Private
const getAllFeedbacks = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find().populate("user");

  if (!feedbacks) {
    res.status(404);
    throw new Error("No feedbacks found");
  }

  res.status(200).json(feedbacks);
});

// @desc    Reply to feedback
// @route   POST /api/feedback/reply
// @access  Private
const replyFeedback = asyncHandler(async (req, res) => {
  const { feedbackId, subject, content } = req.body;

  const feedback = await Feedback.findById(feedbackId).populate("user");

  if (!feedback) {
    res.status(404);
    throw new Error("Feedback not found");
  }

  const emailResult = await sendEmail({
    email: feedback.user.email,
    subject,
    content,
  });

  res.status(200).json(emailResult);
});

export { createFeedback, getAllFeedbacks, replyFeedback };
