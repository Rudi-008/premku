const Order = require("../models/Order");
const { upsertSubscription } = require("../services/subscription.service");

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("productId", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ORDER STATUS (ADMIN CONTROL)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    // 🔥 AUTO TRIGGER ONLY WHEN PAID
    if (status === "paid") {
      await upsertSubscription({
        userId: order.userId,
        productId: order.productId,
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};