require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./models');
const carRoutes = require('./routes/carRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// ✅ Middleware CORS único e limpo
app.use(cors({
  origin: [
    'https://broker-car-store.vercel.app',
    'https://broker-store-production.up.railway.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));

// 📋 Middleware para log
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Endpoint de health check (pra testar se o backend tá vivo)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 🌐 Suas rotas
app.use('/api/cars', carRoutes);
app.use('/api/contacts', contactRoutes);

// ❌ Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('=== INICIANDO SERVIDOR ===');
    console.log('Porta:', PORT);
    console.log('Ambiente:', process.env.NODE_ENV || 'development');

    console.log('Conectando ao MongoDB...');
    await connectDB();
    console.log('MongoDB conectado com sucesso!');

    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM recebido, fechando servidor...');
      server.close(() => {
        console.log('Servidor fechado.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT recebido, fechando servidor...');
      server.close(() => {
        console.log('Servidor fechado.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

startServer();
