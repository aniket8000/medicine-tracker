// Import mongoose for schema definition.
import mongoose from "mongoose";

// Define the structure of a pharmacy document in MongoDB.
const pharmacySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Pharmacy name is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },

    // ✅ Geo coordinates for map view
    location: {
      lat: {
        type: Number,
        required: false,
        default: 0,
      },
      lon: {
        type: Number,
        required: false,
        default: 0,
      },
    },

    // ✅ Medicines array
    medicines: [
      {
        name: {
          type: String,
          required: [true, "Medicine name is required"],
          trim: true,
        },
        quantity: {
          type: Number,
          default: 0,
          min: [0, "Quantity cannot be negative"],
        },
        price: {
          type: Number,
          default: 0,
          min: [0, "Price cannot be negative"],
        },
      },
    ],
  },
  {
    timestamps: true, // Auto-adds createdAt & updatedAt fields
  }
);

// ✅ Create an index for location (future: nearest pharmacy feature)
pharmacySchema.index({ "location.lat": 1, "location.lon": 1 });

// Export model to use in controllers.
const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
export default Pharmacy;
