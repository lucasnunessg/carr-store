require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./models');
const carRoutes = require('./routes/carRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Middleware CORS mais robusto
app.use(cors({
  origin: true, // Permitir todas as origins temporariamente para debug
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Middleware para logs de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para headers CORS adicionais
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/cars', carRoutes);
app.use('/api/contacts', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

// Inicializar banco de dados e iniciar servidor
async function startServer() {
  try {
    console.log('=== INICIANDO SERVIDOR ===');
    console.log('Porta:', PORT);
    console.log('Ambiente:', process.env.NODE_ENV || 'development');
    
    // Conectar ao MongoDB
    console.log('Conectando ao MongoDB...');
    await connectDB();
    console.log('MongoDB conectado com sucesso!');
    
    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
    });
    
    // Graceful shutdown
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