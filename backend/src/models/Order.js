const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

    amount: Number,

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      default: "dummy",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);