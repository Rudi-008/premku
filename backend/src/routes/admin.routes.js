const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const admin = require("../controllers/admin.controller");

// admin only route
router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin stats data" });
  }
);

router.get(
  "/analytics",
  protect,
  authorizeRoles("admin"),
  admin.getAnalytics
);

module.exports = router;