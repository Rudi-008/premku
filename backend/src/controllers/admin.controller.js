const Order = require("../models/Order");
const Subscription = require("../models/Subscription");

exports.getAnalytics = async (req, res) => {
  try {
    // TOTAL REVENUE (only paid orders)
    const revenueAgg = await Order.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // TOTAL ORDERS
    const totalOrders = await Order.countDocuments();

    // ACTIVE SUBSCRIPTIONS
    const activeSubscriptions = await Subscription.countDocuments({
      status: "active",
    });

    // RECENT ORDERS
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("productId")
      .populate("userId", "name email");

    res.json({
      totalRevenue,
      totalOrders,
      activeSubscriptions,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};