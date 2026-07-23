import express from "express";
import { body } from "express-validator";
import { submitContactMessage } from "../controllers/contactController.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("message")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Message must be at least 10 characters"),
  ],
  validate,
  submitContactMessage
);

export default router;
