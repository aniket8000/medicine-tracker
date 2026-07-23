import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import { sendOrderConfirmationEmail } from "../utils/mailer.js";

// Create a new order (customer, must be logged in)
export const createOrder = async (req, res) => {
  try {
    const { name, contact, address, items, total } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Order must contain at least one item" });

    const order = await Order.create({
      user: req.user.id,
      name,
      contact,
      address,
      items,
      total,
    });

    res.status(201).json(order);

    // Best-effort confirmation email — a delivery failure here shouldn't
    // undo an order that was already saved and returned to the customer.
    try {
      const user = await User.findById(req.user.id);
      if (user?.email) await sendOrderConfirmationEmail(user.email, order);
    } catch (emailError) {
      console.error("Order confirmation email failed:", emailError.message);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get orders placed by the logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
