const mongoose = require('mongoose');
const Car = require('./Car');
const Contact = require('./Contact');
const User = require('./User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Tentando conectar ao MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Definida' : 'Não definida');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 segundos
      socketTimeoutMS: 45000, // 45 segundos
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Conexão estabelecida com sucesso!');
    
    // Testar a conexão
    await mongoose.connection.db.admin().ping();
    console.log('Ping ao MongoDB bem-sucedido!');
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.error('Detalhes do erro:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Tentar novamente após 5 segundos
    console.log('Tentando reconectar em 5 segundos...');
    setTimeout(() => {
      connectDB();
    }, 5000);
  }
};

module.exports = {
  connectDB,
  Car,
  Contact,
  User
}; 