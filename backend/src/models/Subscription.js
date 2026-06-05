const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },

    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

subscriptionSchema.index(
  { userId: 1, productId: 1, status: 1 }
);



module.exports = mongoose.model("Subscription", subscriptionSchema);