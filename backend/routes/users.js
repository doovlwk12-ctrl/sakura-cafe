const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @desc   Get all users (Admins only)
 * @route  GET /api/users
 * @access Private/Admin
 */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @desc   Update user (Admin or self)
 * @route  PUT /api/users/:id
 * @access Private (Admin or Self)
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const { username, email, role } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // تحقق من الصلاحية: Admin أو نفس المستخدم
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    user.username = username || user.username;
    user.email = email || user.email;

    // فقط الأدمن يقدر يغير الدور
    if (req.user.role === "admin" && role) {
      user.role = role;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @desc   Update user password
 * @route  PUT /api/users/:id/password
 * @access Private (Admin or Self)
 */
router.put("/:id/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // تحقق من الصلاحية: Admin أو نفس المستخدم
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // لو المستخدم نفسه → يلزم كلمة المرور الحالية
    if (req.user.role !== "admin") {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
    }

    // تحديث كلمة المرور
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: "✅ Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @desc   Delete user by ID (Admins only)
 * @route  DELETE /api/users/:id
 * @access Private/Admin
 */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "✅ User removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;