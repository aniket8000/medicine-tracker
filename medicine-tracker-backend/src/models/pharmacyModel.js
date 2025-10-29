// Import mongoose for schema definition.
import mongoose from "mongoose";

// Define the structure of a pharmacy document in MongoDB.
const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },                // Pharmacy name
    address: { type: String, required: true },             // Full address
    contact: { type: String, required: true },             // Phone number
    location: {
      lat: { type: Number, default: 0 },                   // Latitude (optional)
      lon: { type: Number, default: 0 },                   // Longitude (optional)
    },
    medicines: [
      {
        name: { type: String, required: true },            // Medicine name
        quantity: { type: Number, default: 0 },            // Quantity available
        price: { type: Number, default: 0 },               // Price per unit
      },
    ],
  },
  { timestamps: true }                                     // Auto-adds createdAt & updatedAt fields
);

// Export model to use in controllers.
const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
export default Pharmacy;
