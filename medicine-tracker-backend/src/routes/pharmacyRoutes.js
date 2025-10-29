// Import express and controller functions.
import express from "express";
import { addPharmacy, getPharmacies, updatePharmacy } from "../controllers/pharmacyController.js";

const router = express.Router();

// Define API routes and connect them to controller functions.
router.post("/", addPharmacy);        // Add a new pharmacy
router.get("/", getPharmacies);       // Get all pharmacies
router.put("/:id", updatePharmacy);   // Update pharmacy by ID

export default router;
