require("dotenv").config();
const asyncHandle = require("express-async-handler");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const payHandle = asyncHandle(async (req, res) => {
  try {
    const { cost } = req.body;

    if (!cost) return res.status(400).json({ message: "Please enter a cost" });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100 * cost, // Amount in the smallest currency unit (e.g., cents for USD)
      currency: "USD",
      payment_method_types: ["card"],
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ message: "Payment initiated", clientSecret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// const stripeHandle = asyncHandle(async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;
//   try {
//     event = await stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: err.message });
//   }

//   // Event when a payment is initiated
//   if (event.type === "payment_intent.created") {
//     console.log(`${event.data.object.metadata.name} initated payment!`);
//   }
//   // Event when a payment is succeeded
//   if (event.type === "payment_intent.succeeded") {
//     console.log(`${event.data.object.metadata.name} succeeded payment!`);
//     // fulfilment
//   }
//   res.json({ ok: true });
// });

module.exports = {
  payHandle,
  // stripeHandle,
};
