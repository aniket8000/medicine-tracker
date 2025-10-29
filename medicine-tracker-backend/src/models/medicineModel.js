// Import mongoose for schema creation.
import mongoose from "mongoose";

// Define structure of the medicine collection.
const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },  // Medicine name (unique)
    genericName: { type: String },                         // Generic name (optional)
    category: { type: String },                            // Category (like antibiotic, painkiller)
    description: { type: String },                         // Short description
  },
  { timestamps: true }
);

// Export model
const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;
