const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./src/models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const existingAdmin = await User.findOne({
      email: "admin@premku.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@premku.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully:", admin.email);

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedAdmin();