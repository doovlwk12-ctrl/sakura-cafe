const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@sakura.com" });
    
    if (existingAdmin) {
      console.log("👤 Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      username: "admin",
      email: "admin@sakura.com",
      password: "admin123",
      role: "admin"
    });

    console.log("✅ Admin user created successfully:");
    console.log("Email: admin@sakura.com");
    console.log("Password: admin123");
    console.log("Role: admin");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();
