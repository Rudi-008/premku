const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const billingController = require("../controllers/billing.controller");

// INVOICE HISTORY
router.get(
  "/invoices",
  protect,
  billingController.getMyInvoices
);

module.exports = router;