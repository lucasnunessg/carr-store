const mongoose = require('mongoose');
const Car = require('./Car');
const Contact = require('./Contact');
const User = require('./User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  Car,
  Contact,
  User
}; 