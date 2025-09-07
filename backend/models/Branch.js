const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  mapUrl: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ""
  },
  hours: {
    type: String,
    default: "السبت - الخميس: 6:00 ص - 12:00 م"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Branch = mongoose.model("Branch", branchSchema);
module.exports = Branch;
