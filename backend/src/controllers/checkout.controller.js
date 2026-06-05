const Order = require("../models/Order");
const Subscription = require("../models/Subscription");
const Product = require("../models/Product");

// CREATE ORDER (checkout awal)
exports.createOrder = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingPending = await Order.findOne({
      userId: req.user._id,
      productId,
      status: "pending",
    });

    if (existingPending) {
      return res.json(existingPending);
    }

    const order = await Order.create({
      userId: req.user._id,
      productId,
      amount: product.price,
      status: "pending",
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DUMMY PAYMENT SUCCESS
exports.payOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // update order
    order.status = "paid";
    await order.save();

    // create subscription (AUTO ACTIVE)
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 30); // 30 hari subscription

    const subscription = await Subscription.create({
      userId: order.userId,
      productId: order.productId,
      status: "active",
      startDate: start,
      endDate: end,
    });

    res.json({
      message: "Payment success (dummy)",
      order,
      subscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USER SUBSCRIPTIONS
exports.mySubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({
      userId: req.user._id,
    }).populate("productId");

    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};