const Subscription = require("../models/Subscription");

exports.getMySubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({
      userId: req.user._id,
      status: "active",
    }).populate("productId");

    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};