const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");

const checkout = require("../controllers/checkout.controller");

router.post("/create", protect, checkout.createOrder);
router.post("/pay", protect, checkout.payOrder);
router.get("/subscriptions", protect, checkout.mySubscriptions);

module.exports = router;