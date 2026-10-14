const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const users = [
  {
    name: 'Admin User',
    email: 'admin@roavista.com',
    password: hashPassword('123456'),
    contact: '9876543210',
    location: 'Nagpur, Maharashtra',
    role: 'admin'
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: hashPassword('123456'),
    contact: '9876543211',
    location: 'Nagpur, Maharashtra',
    role: 'user'
  },
  {
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: hashPassword('123456'),
    contact: '9876543212',
    location: 'Pune, Maharashtra',
    role: 'user'
  }
];

const items = [
  {
    title: 'Vintage Denim Jacket',
    clothingType: 'Jacket',
    brandName: "Levi's",
    size: 'M',
    condition: 'Good',
    estimatedValue: 1500,
    location: 'Nagpur, Maharashtra',
    images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    status: 'available'
  },
  {
    title: 'Black Zara Evening Dress',
    clothingType: 'Dress',
    brandName: 'Zara',
    size: 'S',
    condition: 'Like New',
    estimatedValue: 2000,
    location: 'Pune, Maharashtra',
    images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    status: 'available'
  },
  {
    title: 'Nike Air Hooded Sweatshirt',
    clothingType: 'Hoodie',
    brandName: 'Nike',
    size: 'L',
    condition: 'New with tags',
    estimatedValue: 1800,
    location: 'Nagpur, Maharashtra',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    status: 'available'
  }
];

module.exports = { users, items };