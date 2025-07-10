require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const createAdminUser = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Conectado ao MongoDB');

    // Verificar se já existe um admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Usuário admin já existe:', existingAdmin.email);
      return;
    }

    // Criar usuário admin
    const adminUser = new User({
      name: 'Administrador',
      email: 'admin@carsstore.com',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: admin@carsstore.com');
    console.log('🔑 Senha: admin123');
    console.log('👤 Role: admin');

  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser(); 