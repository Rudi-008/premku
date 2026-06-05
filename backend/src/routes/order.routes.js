const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const order = require("../controllers/order.controller");

// ADMIN ONLY
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  order.getAllOrders
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  order.updateOrderStatus
);

module.exports = router;