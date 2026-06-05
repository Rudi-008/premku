const Subscription = require("../models/Subscription");

exports.upsertSubscription = async ({ userId, productId }) => {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 30);

  // cek existing active subscription
  const existing = await Subscription.findOne({
    userId,
    productId,
    status: "active",
  });

  if (existing) {
    // extend subscription instead of duplicate
    existing.endDate = end;
    await existing.save();
    return existing;
  }

  // create new subscription
  const sub = await Subscription.create({
    userId,
    productId,
    status: "active",
    startDate: start,
    endDate: end,
  });

  return sub;
};

exports.ensureSubscriptionState = async () => {
  const now = new Date();

  await Subscription.updateMany(
    {
      status: "active",
      endDate: { $lt: now },
    },
    {
      status: "expired",
    }
  );
};