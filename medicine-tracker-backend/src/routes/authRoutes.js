import express from "express";
import { body, param } from "express-validator";
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["customer", "admin"])
      .withMessage("Role must be 'customer' or 'admin'"),
  ],
  validate,
  registerUser
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  loginUser
);

router.get("/me", protect, getMe);

router.post(
  "/forgot-password",
  [body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail()],
  validate,
  forgotPassword
);

router.post(
  "/reset-password/:token",
  [
    param("token").isHexadecimal().withMessage("Invalid reset token"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  resetPassword
);

export default router;
