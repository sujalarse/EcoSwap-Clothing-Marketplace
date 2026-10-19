const mongoose = require('mongoose');
const Clothing = require('./models/Clothing');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('Connected to MongoDB Atlas for seeding...');

    // Clear old data
    await Clothing.deleteMany({});
    await User.deleteMany({});

    // Create Demo Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user1 = await User.create({
      name: 'Sujal Arse',
      email: 'sujal@example.com',
      password: hashedPassword,
      location: 'Nagpur',
      role: 'admin'
    });

    const user2 = await User.create({
      name: 'Atharv Deshmukh',
      email: 'atharv@example.com',
      password: hashedPassword,
      location: 'Nagpur',
      role: 'user'
    });

    // Create Sample Clothing Items
    await Clothing.insertMany([
      {
        owner: user1._id,
        title: "Levi's Classic Trucker Denim Jacket",
        category: 'Jacket',
        brand: "Levi's",
        size: 'L',
        condition: 'Like New',
        estimatedValue: 71,
        location: 'Nagpur',
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop',
        status: 'available'
      },
      {
        owner: user2._id,
        title: 'Zara Oversized Wool Blend Coat',
        category: 'Coat',
        brand: 'Zara',
        size: 'M',
        condition: 'New with tags',
        estimatedValue: 112,
        location: 'Nagpur',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&auto=format&fit=crop',
        status: 'available'
      },
      {
        owner: user1._id,
        title: 'Nike Air Jordan High Retro',
        category: 'Shoes',
        brand: 'Nike',
        size: 'XL',
        condition: 'Good',
        estimatedValue: 64,
        location: 'Nagpur',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop',
        status: 'available'
      }
    ]);

    console.log('Sample users and clothing items seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();