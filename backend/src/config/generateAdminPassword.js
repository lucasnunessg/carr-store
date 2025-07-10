const bcrypt = require('bcryptjs');

async function generatePassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Senha criptografada:', hash);
}

// Gerar senha para 'admin123'
generatePassword('admin123'); 