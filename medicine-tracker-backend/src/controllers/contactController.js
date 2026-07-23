import { sendContactMessage } from "../utils/mailer.js";

export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await sendContactMessage({ name, email, message });
    res.status(200).json({ message: "Your message has been sent. We'll get back to you soon." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};
