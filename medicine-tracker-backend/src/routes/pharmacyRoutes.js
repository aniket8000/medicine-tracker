import express from "express";
import {
  addPharmacy,
  getPharmacies,
  updatePharmacy,
  deletePharmacy,
  deleteMedicineFromPharmacy,
} from "../controllers/pharmacyController.js";

const router = express.Router();

// Create new pharmacy
router.post("/", addPharmacy);

// Get all pharmacies
router.get("/", getPharmacies);

// Update pharmacy
router.put("/:id", updatePharmacy);

// Delete entire pharmacy
router.delete("/:id", deletePharmacy);

// Delete a single medicine from pharmacy
router.delete("/:pharmacyId/medicine/:medicineName", deleteMedicineFromPharmacy);

export default router;
