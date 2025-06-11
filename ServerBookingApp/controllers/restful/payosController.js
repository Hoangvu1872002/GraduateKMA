require("dotenv").config();
const asyncHandle = require("express-async-handler");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const driverModel = require("../../models/driverModel");

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

const rechargeHandle = asyncHandle(async (req, res) => {
  try {
    const { cost } = req.body;
    const { _id } = req.user;

    if (!cost || !_id)
      return res
        .status(400)
        .json({ message: "Please enter a cost and driverId" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100 * cost, // Amount in cents for USD
      currency: "USD",
      payment_method_types: ["card"],
    });
    const clientSecret = paymentIntent.client_secret;

    // Cộng thêm vào balence cho driver
    const driver = await driverModel.findById(_id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    driver.balence += Number(cost);
    await driver.save();

    res.json({
      data: {
        message: "Payment initiated and balance updated",
        clientSecret,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const rechargeBalanceAndNotify = asyncHandle(async (req, res) => {
  try {
    const { cost, driverId } = req.body;
    if (!driverId || !cost) {
      return res.status(400).json({ message: "Missing driverId or amount" });
    }

    const driver = await driverModel.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.balence += Number(cost);
    await driver.save();

    // Emit sự kiện đến tài xế
    const io = req.app.get("io");
    if (io && driver.socketId) {
      io.of("/booking").to(driver.socketId).emit("payment-success");
    }

    res.json({
      data: {
        success: true,
      },
    });
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
  rechargeHandle,
  rechargeBalanceAndNotify,
  // stripeHandle,
};
