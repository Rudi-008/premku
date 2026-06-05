const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const expireSubscriptionsJob =
  require("./services/subscriptionExpiry.service");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const billingRoutes = require("./routes/billing.routes");


const app = express();

// middleware global
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

// test route
app.get("/", (req, res) => {
  res.json({
    message: "premku API is running 🚀"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/billing", billingRoutes);

expireSubscriptionsJob();

module.exports = app;