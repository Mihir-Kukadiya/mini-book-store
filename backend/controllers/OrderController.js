import Order from "../models/OrderModel.js";

// ================= PLACE ORDER (USER) =================
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      address, // ✅ THIS WAS MISSING AT RUNTIME
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: "Order failed" });
  }
};

// ================= USER ORDERS =================
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

// ================= UPDATE ORDER STATUS (ADMIN) =================
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};


// ================= ADMIN ORDERS =================
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "email")
    .sort({ createdAt: -1 });
  res.json(orders);
};
