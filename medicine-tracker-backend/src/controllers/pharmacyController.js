import Pharmacy from "../models/pharmacyModel.js";

// =============================
//  ADD PHARMACY
// =============================
export const addPharmacy = async (req, res) => {
  try {
    const pharmacy = new Pharmacy(req.body);
    const savedPharmacy = await pharmacy.save();
    res.status(201).json(savedPharmacy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// =============================
//  GET ALL PHARMACIES
// =============================
export const getPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.status(200).json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
//  UPDATE PHARMACY
// =============================
export const updatePharmacy = async (req, res) => {
  try {
    const updated = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Pharmacy not found" });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
//  DELETE PHARMACY
// =============================
export const deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);

    if (!pharmacy)
      return res.status(404).json({ message: "Pharmacy not found" });

    res.status(200).json({ message: "Pharmacy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
//  DELETE MEDICINE FROM PHARMACY
// =============================
export const deleteMedicineFromPharmacy = async (req, res) => {
  try {
    const { pharmacyId, medicineName } = req.params;

    const pharmacy = await Pharmacy.findById(pharmacyId);

    if (!pharmacy)
      return res.status(404).json({ message: "Pharmacy not found" });

    const before = pharmacy.medicines.length;

    pharmacy.medicines = pharmacy.medicines.filter(
      (m) => m.name.toLowerCase() !== medicineName.toLowerCase()
    );

    if (pharmacy.medicines.length === before)
      return res.status(404).json({ message: "Medicine not found" });

    await pharmacy.save();

    res.status(200).json({
      message: `Medicine '${medicineName}' deleted successfully`,
      pharmacy,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
