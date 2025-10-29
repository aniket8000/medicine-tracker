// Import the Pharmacy model.
import Pharmacy from "../models/pharmacyModel.js";

// @desc Add a new pharmacy
// @route POST /api/pharmacies
export const addPharmacy = async (req, res) => {
  try {
    const pharmacy = new Pharmacy(req.body);   // Create a new pharmacy from request body
    const savedPharmacy = await pharmacy.save(); // Save to MongoDB
    res.status(201).json(savedPharmacy);       // Return created pharmacy
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all pharmacies
// @route GET /api/pharmacies
export const getPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();  // Fetch all pharmacy records
    res.status(200).json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update pharmacy (for updating stock, etc.)
// @route PUT /api/pharmacies/:id
export const updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
