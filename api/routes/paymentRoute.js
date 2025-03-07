const express = require("express");
const stripeController = require("../controller/stripeController.js");
const { authenticate } = require("../middleware/auth.js");

const router = express.Router();

// ? stripe customer creation
router.post("/stripe-customer", authenticate, stripeController.createCustomer);
router.post("/add-card", authenticate, stripeController.addCardWithToken);
router.post("/make-payment", authenticate, stripeController.makePayment);

module.exports = router;