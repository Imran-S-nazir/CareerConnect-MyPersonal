// models/PendingOTP.js
const mongoose = require("mongoose");

const pendingOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // Step 1 data temporary store (optional)
  tempData: {
    fullName: String,
    phone: String,
    password: String, // hashed already? better store plain only in memory - yahan skip
  },
}, { timestamps: true });

// Auto delete after expire
pendingOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PendingOTP", pendingOTPSchema);