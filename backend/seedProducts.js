const mongoose = require("mongoose");
const slugify = require("slugify");
require("dotenv").config();

const Product = require("./src/models/Product");

const products = [
  {
    name: "ChatGPT Premium Access",
    description: "Akses ChatGPT Plus dengan fitur lengkap dan cepat",
    price: 50000,
    category: "AI Tools",
    features: ["GPT-4", "Faster response", "Priority access"],
  },
  {
    name: "Netflix Shared Account",
    description: "Akun Netflix sharing premium",
    price: 30000,
    category: "Entertainment",
    features: ["4K Support", "Multi profile", "Stable access"],
  },
  {
    name: "Spotify Premium",
    description: "Akses Spotify tanpa iklan",
    price: 25000,
    category: "Music",
    features: ["No Ads", "Offline mode", "High quality audio"],
  },
  {
    name: "Canva Pro",
    description: "Desain premium Canva full fitur",
    price: 20000,
    category: "Design",
    features: ["Premium template", "Brand kit", "Background remover"],
  },
  {
    name: "YouTube Premium",
    description: "YouTube tanpa iklan + background play",
    price: 28000,
    category: "Entertainment",
    features: ["No ads", "Background play", "YouTube Music"],
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ Connected to MongoDB");

    for (const p of products) {
      const exists = await Product.findOne({ name: p.name });

      if (exists) {
        console.log(`⏭️ Skipped (exists): ${p.name}`);
        continue;
      }

      const slug = slugify(p.name, { lower: true });

      await Product.create({
        ...p,
        slug,
        isActive: true,
      });

      console.log(`✅ Inserted: ${p.name}`);
    }

    console.log("🎉 Seeding completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seedProducts();