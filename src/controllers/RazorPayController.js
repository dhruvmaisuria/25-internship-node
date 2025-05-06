const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const AppointmentModel = require("../models/AppointmentModel");
require('dotenv').config();


// Razorpay instance
const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
});

// API to create an order
const create_order =async (req, res) => {
  const { amount, currency, receipt } = req.body;
  
  const options = {
    amount: amount * 100, // Razorpay expects the amount in paise
    currency: currency,
    receipt: receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order); // Returns the order details, including order_id
  } catch (error) {
    console.log(error)
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//API to verify the payment signature (optional for backend verification)
const verify_order = async (req, res) => {
  const crypto = require("crypto");

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret = "T88p96PnHoJofjrsX5Ki28o4";

  const hash = crypto.createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
  console.log(hash, razorpay_signature);
  if (hash === razorpay_signature) {
    res.json({ status: "success" });
  } else {
    res.status(400).json({ status: "failure" });
  }
};


// const verify_order = async (req, res) => {
//   const crypto = require("crypto");
 

//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     appointmentId,
//   } = req.body;

//   const secret = "T88p96PnHoJofjrsX5Ki28o4";

//   const hash = crypto
//     .createHmac("sha256", secret)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");

//   console.log("Hash:", hash, "Signature:", razorpay_signature);

//   if (hash === razorpay_signature) {
//     try {
//       // ✅ Update appointment with payment details
//       await AppointmentModel.findByIdAndUpdate(appointmentId, {
//         razorpay_order_id,
//         razorpay_payment_id,
//         payment_verified: true,
//       });

//       res.json({ status: "success", message: "Payment verified and appointment updated." });
//     } catch (error) {
//       console.error("DB update error:", error);
//       res.status(500).json({ status: "error", message: "Failed to update appointment." });
//     }
//   } else {
//     res.status(400).json({ status: "failure", message: "Payment signature mismatch" });
//   }
// };

module.exports = {
    create_order,
    verify_order,
}