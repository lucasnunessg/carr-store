const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  try {
    // Criar conexão sem banco de dados
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('Conectado ao MySQL');

    // Ler arquivo SQL
    const sqlFile = await fs.readFile(
      path.join(__dirname, 'init.sql'),
      'utf8'
    );

    // Executar comandos SQL
    const commands = sqlFile.split(';').filter(cmd => cmd.trim());
    for (const command of commands) {
      if (command.trim()) {
        await connection.query(command);
      }
    }

    console.log('Banco de dados inicializado com sucesso!');
    await connection.end();
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase; 