const mongoose = require("mongoose");
const Branch = require("./models/Branch");
require("dotenv").config();

const seedBranches = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing branches
    await Branch.deleteMany({});
    console.log("🗑️ Cleared existing branches");

    // Create sample branches with the provided data
    const branches = [
      {
        name: "مقهى ساكورا - صديان",
        address: "حي صديان",
        mapUrl: "https://maps.app.goo.gl/PnN5EJBmDTsYxaCL8",
        phone: "+966 11 123 4567",
        hours: "السبت - الخميس: 6:00 ص - 12:00 م"
      },
      {
        name: "مقهى ساكورا - النقرة",
        address: "حي النقرة",
        mapUrl: "https://maps.app.goo.gl/8oD2AP95XeVUKiVm6",
        phone: "+966 11 234 5678",
        hours: "السبت - الخميس: 6:00 ص - 12:00 م"
      },
      {
        name: "مقهى ساكورا - الجامعيين",
        address: "حي الجامعيين",
        mapUrl: "https://maps.app.goo.gl/ihyeyukg9WJp4F158",
        phone: "+966 11 345 6789",
        hours: "السبت - الخميس: 6:00 ص - 12:00 م"
      },
      {
        name: "مقهى ساكورا - طريق المدينة",
        address: "طريق المدينة",
        mapUrl: "https://maps.app.goo.gl/ezCwhSPQKsRZjnN87",
        phone: "+966 11 456 7890",
        hours: "السبت - الخميس: 6:00 ص - 12:00 م"
      },
      {
        name: "مقهى ساكورا - الفجر",
        address: "حي الفجر",
        mapUrl: "https://maps.app.goo.gl/Foertt4h31FRao5F9",
        phone: "+966 11 567 8901",
        hours: "السبت - الخميس: 6:00 ص - 12:00 م"
      },
      {
        name: "مقهى ساكورا - الراجحي",
        address: "حي الراجحي",
        mapUrl: "https://maps.app.goo.gl/hfETbFgXvMudQrN48",
        phone: "+966 11 678 9012",
        hours: "السبت - الخميس: 6:00 ص - 12:00 م"
      }
    ];

    await Branch.insertMany(branches);

    console.log("✅ Sakura Café branches created successfully:");
    branches.forEach((branch, index) => {
      console.log(`${index + 1}. ${branch.name}`);
      console.log(`   📍 ${branch.address}`);
      console.log(`   🗺️ ${branch.mapUrl}`);
      console.log("");
    });

    console.log(`📊 Total branches: ${branches.length}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating branches:", err.message);
    process.exit(1);
  }
};

seedBranches();