const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/productController");
const AuthMiddleware = require("../middleware/authMiddleware");
const RoleMiddleware = require("../middleware/roleMiddleware")
const Validation = require("../validation/validate");

const { createProductSchema } = require("../validation/productValidation");


router.post(
  "/product/create",
  AuthMiddleware.authMiddleware,
  RoleMiddleware("admin"),
  Validation.validate(createProductSchema),
  ProductController.createproduct,
);

router.get("/product/all", ProductController.getAllProducts);

router.get("/product/:id", ProductController.getProductById);

module.exports = router;
