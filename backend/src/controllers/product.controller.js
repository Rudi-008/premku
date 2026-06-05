const Product = require("../models/Product");
const slugify = require("slugify");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, features, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const product = await Product.create({
      name,
      description,
      price,
      category,
      features,
      isActive,
      slug,
    });

    res.json(product);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(400).json({ message: "Product slug already exists" });
    }

    res.status(500).json({ message: err.message });
  }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.name) {
      updateData.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(product);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(400).json({ message: "Product slug already exists" });
    }

    res.status(500).json({ message: err.message });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};