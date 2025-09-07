const express = require("express");
const Branch = require("../models/Branch");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @desc   Get all branches
 * @route  GET /api/branches
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true }).select("-__v");
    res.json(branches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @desc   Get branch by ID
 * @route  GET /api/branches/:id
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json(branch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @desc   Create new branch (Admin only)
 * @route  POST /api/branches
 * @access Private/Admin
 */
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, address, mapUrl, phone, hours } = req.body;

    const branch = new Branch({
      name,
      address,
      mapUrl,
      phone: phone || "",
      hours: hours || "السبت - الخميس: 6:00 ص - 12:00 م"
    });

    await branch.save();
    res.status(201).json(branch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @desc   Update branch (Admin only)
 * @route  PUT /api/branches/:id
 * @access Private/Admin
 */
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, address, mapUrl, phone, hours, isActive } = req.body;

    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { name, address, mapUrl, phone, hours, isActive },
      { new: true, runValidators: true }
    );

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json(branch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @desc   Delete branch (Admin only)
 * @route  DELETE /api/branches/:id
 * @access Private/Admin
 */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json({ message: "✅ Branch deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;