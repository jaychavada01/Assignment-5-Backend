const express = require("express");
const stripeController = require("../controller/stripeController.js");
const { authenticate } = require("../middleware/auth.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management with Stripe
 */

/**
 * @swagger
 * /api/pay/stripe-customer:
 *   post:
 *     summary: Create a new Stripe customer
 *     description: Creates a new Stripe customer and associates it with the authenticated user
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomerRequest'
 *     responses:
 *       200:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCustomerResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/stripe-customer", authenticate, stripeController.createCustomer);

/**
 * @swagger
 * /api/pay/add-card:
 *   post:
 *     summary: Add a new payment card
 *     description: Adds a new card to the authenticated user's Stripe account
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCardRequest'
 *     responses:
 *       200:
 *         description: Card added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddCardResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/add-card", authenticate, stripeController.addCardWithToken);

/**
 * @swagger
 * /api/pay/make-payment:
 *   post:
 *     summary: Process a payment
 *     description: Process a payment using a saved card
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MakePaymentRequest'
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MakePaymentResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/make-payment", authenticate, stripeController.makePayment);

module.exports = router;
