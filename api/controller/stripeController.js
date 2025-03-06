const { STATUS_CODES } = require("../config/constant");
const stripe = require("../config/stripe");
const User = require("../models/user");

const createCustomer = async (req, res) => {
  try {
    const { email, name } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user already has a Stripe customer ID
    if (user.stripeCustomerId) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "User already has a Stripe customer ID",
        stripeCustomerId: user.stripeCustomerId,
      });
    }

    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      name,
      email,
    });

    // Save the Stripe customer ID in the database
    user.stripeCustomerId = customer.id;
    await user.save();

    res.status(STATUS_CODES.CREATED).json({
      message: "Customer created successfully",
      stripeCustomerId: customer.id,
      customer
    });
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    res.status(STATUS_CODES.SERVER_ERROR).json({ message: "Failed to create customer!" });
  }
};

module.exports = { createCustomer };
