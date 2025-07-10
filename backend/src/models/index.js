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
      serverSelectionTimeoutMS: 10000, // 10 segundos para Railway
      socketTimeoutMS: 30000, // 30 segundos
      bufferCommands: false // Permitir buffer para Railway
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
    process.exit(1); // Parar o servidor se não conseguir conectar
  }
};

module.exports = {
  connectDB,
  Car,
  Contact,
  User
}; 