const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["cash", "card"], required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
