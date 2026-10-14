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
  body("items.*.pharmacyId").isMongoId().withMessage("Invalid pharmacy for item"),
  body("items.*.name").trim().notEmpty().withMessage("Item name is required"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Item quantity must be a whole number of at least 1")
    .toInt(),
  // Item prices and the order total are calculated server-side from the
  // pharmacy's stock; any values the client sends are ignored.
];

router.post("/", protect, createOrderRules, validate, createOrder);
router.get("/mine", protect, getMyOrders);

export default router;
