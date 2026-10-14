const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const ClothingItem = require('./models/ClothingItem');
const Swap = require('./models/Swap');
const { users, items } = require('./data/sampleData');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Clear existing data
    await Swap.deleteMany();
    await ClothingItem.deleteMany();
    await User.deleteMany();

    // 2. Insert sample users
    const createdUsers = await User.insertMany(users);
    
    // Get the IDs of the regular users (not the admin)
    const rahulId = createdUsers[1]._id;
    const priyaId = createdUsers[2]._id;

    // 3. Assign items to specific users before inserting
    const sampleItems = items.map((item, index) => {
      // Give the first and third item to Rahul, second to Priya
      return { ...item, owner: index % 2 === 0 ? rahulId : priyaId };
    });

    await ClothingItem.insertMany(sampleItems);

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();