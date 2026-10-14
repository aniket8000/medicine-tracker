// Load .env variables first — ES module imports are evaluated before this
// file's body runs, so modules like utils/mailer.js that read process.env at
// import time would otherwise see undefined values.
import "dotenv/config";

// Import required dependencies
import express from "express";          // Web framework for API routes
import cors from "cors";                // Allow frontend to access backend
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js"; // MongoDB connection logic
import pharmacyRoutes from "./routes/pharmacyRoutes.js"; // Pharmacy routes
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";


// Create express app instance
const app = express();

// Behind a hosting proxy (Render, Heroku, etc.) every request arrives from the
// proxy's IP, so rate limits would be shared by all users. Set TRUST_PROXY to
// the number of proxy hops in front of the app (usually 1) on the host only —
// leaving it unset locally stops clients from spoofing X-Forwarded-For.
if (process.env.TRUST_PROXY) {
  app.set("trust proxy", Number(process.env.TRUST_PROXY) || 1);
}

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

// Stricter limit on auth endpoints to slow down brute-force attempts.
// /me is skipped — the frontend calls it on every page load to verify the
// session, and it shouldn't eat into the login/register budget.
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skip: (req) => req.path === "/me",
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
