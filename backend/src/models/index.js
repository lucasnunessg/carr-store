const mongoose = require('mongoose');
const Car = require('./Car');
const Contact = require('./Contact');
const User = require('./User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Tentando conectar ao MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Definida' : 'Não definida');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Conexão estabelecida com sucesso!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.error('Detalhes do erro:', error.message);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  Car,
  Contact,
  User
}; 