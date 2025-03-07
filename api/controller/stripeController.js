const { STATUS_CODES } = require("../config/constant");
const stripe = require("../config/stripe");
const CardDetails = require("../models/cardDetails");
const User = require("../models/user");

const createCustomer = async (req, res) => {
  try {
    const { email, name } = req.body;

    //? Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: res.t("auth.user_not_found") });
    }

    //? Check if the user already has a Stripe customer ID
    if (user.stripeCustomerId) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: res.t("payment.stripe_customer_exist"),
        stripeCustomerId: user.stripeCustomerId,
      });
    }

    //? Create a new Stripe customer
    const customer = await stripe.customers.create({
      name,
      email,
    });

    //? Save the Stripe customer ID in the database
    user.stripeCustomerId = customer.id;
    await user.save();

    res.status(STATUS_CODES.CREATED).json({
      message: res.t("payment.customer_creation_success"),
      stripeCustomerId: customer.id,
      customer,
    });
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: res.t("payment.customer_creation_failed") });
  }
};

const addCardWithToken = async (req, res) => {
  try {
    const { userId, testToken } = req.body; //? Use testToken ("tok_visa")

    //? Fetch the user and check if they have a Stripe customer ID
    const user = await User.findByPk(userId);
    if (!user || !user.stripeCustomerId) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: res.t("payment.stripe_customer_notfound") });
    }

    //? Create a Payment Method from token
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: { token: testToken }, // Use a test token here
    });

    //? Attach the payment method to the user
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: user.stripeCustomerId,
    });

    //? Save card details in the database
    const newCard = await CardDetails.create({
      userId: user.id,
      stripeCardId: paymentMethod.id,
      last4Digit: paymentMethod.card.last4,
      expMonth: paymentMethod.card.exp_month,
      expYear: paymentMethod.card.exp_year,
      brand: paymentMethod.card.brand,
    });

    res
      .status(STATUS_CODES.CREATED)
      .json({ message: res.t("payment.card_add_success"), card: newCard });
  } catch (error) {
    console.error("Error adding test card:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: res.t("payment.card_add_failed"), error: error.message });
  }
};

const makePayment = async (req, res) => {
  try {
    const { userId, cardId, amount, currency } = req.body;

    //? Fetch the user and check if they have a Stripe customer ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: res.t("payment.stripe_customer_notfound") });
    }

    // ? Fetch saved card details of user
    const card = await CardDetails.findByPk(cardId);
    if (!card) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: res.t("payment.no_card") });
    }

    // ? initiates payment method with paymentIntents
    const paymentInitiate = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency || "usd",
      customer: user.stripeCustomerId,
      payment_method: card.stripeCardId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // Prevents redirect-based payments
      },
    });

    //? Save transaction details in the Card model
    card.transactionId = paymentInitiate.id;
    card.amount = amount;
    card.status = paymentInitiate.status;
    card.client_secret = paymentInitiate.client_secret;
    await card.save();

    res.status(STATUS_CODES.SUCCESS).json({
      message: res.t("payment.payment_success"),
      paymentInitiate: {
        id: paymentInitiate.id,
        amount: paymentInitiate.amount / 100,
        currency: paymentInitiate.currency,
        status: paymentInitiate.status,
        payment_method: paymentInitiate.payment_method,
        latest_charge: paymentInitiate.latest_charge,
        client_secret: paymentInitiate.client_secret
      }
    });
  } catch (error) {
    console.error("Error while making payment!", error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: res.t("payment.payment_failed"),
      error: error.message,
    });
  }
};

module.exports = { createCustomer, addCardWithToken, makePayment };
