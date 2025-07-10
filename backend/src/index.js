require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./models');
const carRoutes = require('./routes/carRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// ✅ Middleware CORS — configurado para produção e dev
app.use(cors({
  origin: true, // Permite origem dinâmica (como Vercel)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// ✅ Logs de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ✅ Rotas principais
app.use('/api/cars', carRoutes);
app.use('/api/contacts', contactRoutes);

// ✅ Tratamento de erro padrão
app.use((err, req, res, next) => {
  console.error('❌ Error handler:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

// ✅ Função principal para iniciar o servidor
async function startServer() {
  try {
    console.log('=== INICIANDO SERVIDOR ===');
    console.log('Porta:', PORT);
    console.log('Ambiente:', process.env.NODE_ENV || 'development');

    // ✅ Conectar ao MongoDB
    console.log('Conectando ao MongoDB...');
    await connectDB();
    console.log('✅ MongoDB conectado com sucesso!');

    // ✅ Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🔗 API Root: http://localhost:${PORT}/api`);
    });

    // ✅ Encerramento suave
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM recebido, encerrando...');
      server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🛑 SIGINT recebido, encerrando...');
      server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    console.error('📜 Stack trace:', error.stack);
    process.exit(1);
  }
}

startServer();
