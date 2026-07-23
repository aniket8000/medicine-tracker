import express from "express";
import { body, param } from "express-validator";
import {
  addPharmacy,
  getPharmacies,
  updatePharmacy,
  deletePharmacy,
  deleteMedicineFromPharmacy,
} from "../controllers/pharmacyController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// Validation chains are mutable builder objects — build separate fresh
// arrays for create (required fields) vs update (optional fields) instead
// of reusing/mutating the same chain instances across both.
const medicinesArrayRules = [
  body("medicines").optional().isArray().withMessage("Medicines must be an array"),
  body("medicines.*.name").trim().notEmpty().withMessage("Medicine name is required"),
  body("medicines.*.quantity")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Medicine quantity must be a non-negative number"),
  body("medicines.*.price")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Medicine price must be a non-negative number"),
];

const createPharmacyRules = [
  body("name").trim().notEmpty().withMessage("Pharmacy name is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("contact").trim().notEmpty().withMessage("Contact number is required"),
  ...medicinesArrayRules,
];

const updatePharmacyRules = [
  body("name").optional().trim().notEmpty().withMessage("Pharmacy name cannot be empty"),
  body("address").optional().trim().notEmpty().withMessage("Address cannot be empty"),
  body("contact").optional().trim().notEmpty().withMessage("Contact cannot be empty"),
  ...medicinesArrayRules,
];

const idParamRule = param("id").isMongoId().withMessage("Invalid pharmacy id");

// Get all pharmacies (public)
router.get("/", getPharmacies);

// Create new pharmacy (admin only)
router.post("/", protect, adminOnly, createPharmacyRules, validate, addPharmacy);

// Update pharmacy (admin only)
router.put("/:id", protect, adminOnly, [idParamRule, ...updatePharmacyRules], validate, updatePharmacy);

// Delete entire pharmacy (admin only)
router.delete("/:id", protect, adminOnly, [idParamRule], validate, deletePharmacy);

// Delete a single medicine from pharmacy (admin only)
router.delete(
  "/:pharmacyId/medicine/:medicineName",
  protect,
  adminOnly,
  [
    param("pharmacyId").isMongoId().withMessage("Invalid pharmacy id"),
    param("medicineName").trim().notEmpty().withMessage("Medicine name is required"),
  ],
  validate,
  deleteMedicineFromPharmacy
);

export default router;
