// Import the mongoose library — used to connect Node.js with MongoDB.
import mongoose from "mongoose";

// Define an async function to connect to MongoDB.
const connectDB = async () => {
  try {
    // Use mongoose.connect() to connect to the MongoDB URI stored in the .env file.
    // process.env.MONGO_URI reads the value of MONGO_URI from your environment variables.
    await mongoose.connect(process.env.MONGO_URI);

    // If successful, log a confirmation message in the console.
    console.log(" MongoDB connected successfully");
  } catch (error) {
    // If something goes wrong, print an error message to the console.
    console.error(" MongoDB connection failed:", error.message);

    // Exit the process with failure (status code 1).
    process.exit(1);
  }
};

// Export this function so it can be imported and used in other files (like server.js).
export default connectDB;
