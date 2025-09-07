const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @desc   Get user points
 * @route  GET /api/points/:userId
 * @access Private
 */
router.get("/:userId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("points username email");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // تحقق من الصلاحية: Admin أو نفس المستخدم
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      userId: user._id,
      username: user.username,
      email: user.email,
      points: user.points
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @desc   Add points to user (Admin only)
 * @route  POST /api/points/:userId/add
 * @access Private/Admin
 */
router.post("/:userId/add", protect, async (req, res) => {
  try {
    const { points } = req.body;
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.points += points;
    await user.save();

    res.json({
      message: `✅ ${points} points added successfully`,
      newBalance: user.points
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @desc   Redeem points
 * @route  POST /api/points/:userId/redeem
 * @access Private
 */
router.post("/:userId/redeem", protect, async (req, res) => {
  try {
    const { pointsToRedeem, discountAmount } = req.body;
    
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // تحقق من الصلاحية: Admin أو نفس المستخدم
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (user.points < pointsToRedeem) {
      return res.status(400).json({ 
        message: "Insufficient points",
        currentPoints: user.points,
        requiredPoints: pointsToRedeem
      });
    }

    user.points -= pointsToRedeem;
    await user.save();

    res.json({
      message: `✅ ${pointsToRedeem} points redeemed successfully`,
      discountAmount: discountAmount,
      remainingPoints: user.points
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @desc   Get points history (Admin only)
 * @route  GET /api/points/history/:userId
 * @access Private/Admin
 */
router.get("/history/:userId", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    const user = await User.findById(req.params.userId).select("points username email");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // يمكن إضافة جدول منفصل لتاريخ النقاط لاحقاً
    res.json({
      userId: user._id,
      username: user.username,
      email: user.email,
      currentPoints: user.points,
      message: "Points history feature coming soon"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
