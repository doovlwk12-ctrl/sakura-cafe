const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all orders (authenticated users)
router.get("/", protect, async (req, res) => {
  const orders = await Order.find().populate("items.productId");
  res.json(orders);
});

// Create order (authenticated users)
router.post("/", protect, async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // إضافة النقاط للعميل (1 نقطة لكل 10 ريال)
    if (req.body.userId) {
      const user = await User.findById(req.body.userId);
      if (user) {
        const pointsEarned = Math.floor(order.total / 10);
        user.points += pointsEarned;
        await user.save();
        
        // إضافة معلومات النقاط للرد
        order.pointsEarned = pointsEarned;
        order.userPointsBalance = user.points;
      }
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
