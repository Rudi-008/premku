const cron = require("node-cron");
const Subscription = require("../models/Subscription");

const expireSubscriptionsJob = () => {
  // runs every 1 minute (for demo)
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const expired = await Subscription.updateMany(
        {
          status: "active",
          endDate: { $lt: now },
        },
        {
          $set: { status: "expired" },
        }
      );

      if (expired.modifiedCount > 0) {
        console.log(
          `[CRON] Expired ${expired.modifiedCount} subscriptions`
        );
      }
    } catch (err) {
      console.error("[CRON ERROR]", err.message);
    }
  });
};

module.exports = expireSubscriptionsJob;