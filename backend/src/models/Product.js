const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    description: String,
    price: Number,
    category: String,
    features: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);