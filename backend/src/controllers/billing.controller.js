const Order = require("../models/Order");

exports.getMyInvoices = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
    })
      .populate("productId", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};