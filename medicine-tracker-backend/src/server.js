// Import required dependencies
import express from "express";          // Web framework for API routes
import dotenv from "dotenv";            // Load .env variables
import cors from "cors";                // Allow frontend to access backend
import connectDB from "./config/db.js"; // MongoDB connection logic
import pharmacyRoutes from "./routes/pharmacyRoutes.js"; // Pharmacy routes

// Load environment variables early
dotenv.config();

// Create express app instance
const app = express();

// ---------- Middlewares ----------
app.use(cors());           // Enable CORS
app.use(express.json());   // Parse JSON request bodies

// ---------- API Routes ----------
app.use("/api/pharmacies", pharmacyRoutes); // All pharmacy routes

// ---------- Test Route ----------
app.get("/", (req, res) => {
  res.send("Backend is running ");
});

// ---------- Server Setup ----------
const PORT = process.env.PORT || 5000;

// Connect DB first, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\ MongoDB Connected Successfully`);
      console.log(` Server running at: http://localhost:${PORT}\n`);
    });
  })
  .catch((error) => {
    console.error(" MongoDB Connection Failed:", error.message);
  });
