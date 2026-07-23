import express from "express";
import { body } from "express-validator";
import { createOrder, getMyOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const createOrderRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("contact").trim().notEmpty().withMessage("Contact is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("items").isArray({ min: 1 }).withMessage("Order must contain at least one item"),
  body("items.*.name").trim().notEmpty().withMessage("Item name is required"),
  body("items.*.quantity")
    .isFloat({ min: 1 })
    .withMessage("Item quantity must be at least 1"),
  body("items.*.price").isFloat({ min: 0 }).withMessage("Item price must be a non-negative number"),
  body("total").isFloat({ min: 0 }).withMessage("Total must be a non-negative number"),
];

router.post("/", protect, createOrderRules, validate, createOrder);
router.get("/mine", protect, getMyOrders);

export default router;
