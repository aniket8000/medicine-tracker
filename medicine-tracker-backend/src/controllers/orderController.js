import Order from "../models/orderModel.js";
import Pharmacy from "../models/pharmacyModel.js";
import User from "../models/userModel.js";
import { sendOrderConfirmationEmail } from "../utils/mailer.js";

// Create a new order (customer, must be logged in)
export const createOrder = async (req, res) => {
  try {
    const { name, contact, address, items } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Order must contain at least one item" });

    // Prices and stock are always read from the database — any price/total
    // sent by the client is ignored so an order can't be placed at a
    // tampered price.
    const pharmacyIds = [...new Set(items.map((item) => item.pharmacyId))];
    const pharmacies = await Pharmacy.find({ _id: { $in: pharmacyIds } });
    const pharmacyById = new Map(pharmacies.map((p) => [p._id.toString(), p]));

    const orderItems = [];
    for (const item of items) {
      const pharmacy = pharmacyById.get(item.pharmacyId);
      const medicine = pharmacy?.medicines.find((m) => m.name === item.name);

      if (!medicine)
        return res.status(400).json({
          message: `${item.name} is no longer available${pharmacy ? ` at ${pharmacy.name}` : ""}`,
        });

      if (item.quantity > medicine.quantity)
        return res.status(400).json({
          message: `Only ${medicine.quantity} of ${medicine.name} left in stock at ${pharmacy.name}`,
        });

      orderItems.push({
        name: medicine.name,
        pharmacyId: pharmacy._id,
        pharmacyName: pharmacy.name,
        quantity: item.quantity,
        price: medicine.price,
      });
    }

    const total =
      Math.round(
        orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
      ) / 100;

    const order = await Order.create({
      user: req.user.id,
      name,
      contact,
      address,
      items: orderItems,
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
