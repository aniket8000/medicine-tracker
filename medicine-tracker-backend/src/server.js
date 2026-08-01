// Import required dependencies
import express from "express";          // Web framework for API routes
import dotenv from "dotenv";            // Load .env variables
import cors from "cors";                // Allow frontend to access backend
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js"; // MongoDB connection logic
import pharmacyRoutes from "./routes/pharmacyRoutes.js"; // Pharmacy routes
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";


// Load environment variables early
dotenv.config();

// Create express app instance
const app = express();

// ---------- Middlewares ----------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);
app.use(express.json());   // Parse JSON request bodies

// General API rate limit
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
  })
);

// Stricter limit on auth endpoints to slow down brute-force attempts
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many auth attempts, please try again later." },
  })
);

// Stricter limit on the contact form to prevent it being used to spam
app.use(
  "/api/contact",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many messages sent, please try again later." },
  })
);

// ---------- API Routes ----------
app.use("/api/pharmacies", pharmacyRoutes); // All pharmacy routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);


// ---------- Test Route ----------
app.get("/", (req, res) => {
  res.send("Backend is running ");
});

// ---------- Health Check (for uptime monitors like UptimeRobot) ----------
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
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
