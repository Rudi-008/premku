const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const product = require("../controllers/product.controller");

// PUBLIC
router.get("/", product.getProducts);
router.get("/:id", product.getProduct);

// ADMIN ONLY
router.post("/", protect, authorizeRoles("admin"), product.createProduct);
router.put("/:id", protect, authorizeRoles("admin"), product.updateProduct);
router.delete("/:id", protect, authorizeRoles("admin"), product.deleteProduct);

module.exports = router;