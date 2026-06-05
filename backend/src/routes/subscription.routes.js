const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const subscriptionController = require("../controllers/subscription.controller");

// GET MY ACTIVE SUBSCRIPTIONS
router.get(
  "/me",
  protect,
  subscriptionController.getMySubscriptions
);

module.exports = router;