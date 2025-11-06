require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

connectDB();

async function createAdmin() {
  const admin = new User({
    name: "Murari Kumar",
    email: "murariraj.one@gmail.com",
    phone: "7799169804",
    password: "mur@ri99340", // ✅ plain text, will be hashed by pre-save
    role: "admin",
  });

  await admin.save();
  console.log("✅ Admin user created successfully!");
  mongoose.connection.close();
}

createAdmin().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});
