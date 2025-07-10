# Deploy no Railway - Cars Store

## Configuração dos Serviços

### 1. Backend (API)
- **Diretório**: `backend/`
- **Comando de Build**: `npm install`
- **Comando de Start**: `npm start`
- **Porta**: 3000 (configurada via variável de ambiente PORT)

### 2. Frontend (React)
- **Diretório**: `frontend/`
- **Comando de Build**: `npm install && npm run build`
- **Comando de Start**: `npm run preview`
- **Porta**: Configurada via variável de ambiente PORT (padrão: 4173)

## Passos para Deploy

### 1. Conectar ao Railway
```bash
# Instalar Railway CLI (se ainda não tiver)
npm install -g @railway/cli

# Fazer login
railway login
```

### 2. Deploy do Backend
```bash
# Navegar para o diretório do backend
cd backend

# Inicializar projeto no Railway
railway init

# Fazer deploy
railway up
```

### 3. Deploy do Frontend
```bash
# Navegar para o diretório do frontend
cd frontend

# Inicializar projeto no Railway
railway init

# Fazer deploy
railway up
```

## Variáveis de Ambiente

### Backend
Configure estas variáveis no Railway Dashboard:
- `PORT`: 3000
- `MONGODB_URI`: mongodb+srv://lucasnunespacheco2:8VK3S92LFYZs5wUZ@broker-store.s5oca3p.mongodb.net/broker_store?retryWrites=true&w=majority&appName=broker-store
- `JWT_SECRET`: Chave secreta para JWT
- `CLOUDINARY_CLOUD_NAME`: Nome da cloud do Cloudinary
- `CLOUDINARY_API_KEY`: API Key do Cloudinary
- `CLOUDINARY_API_SECRET`: API Secret do Cloudinary

### Frontend
Configure estas variáveis no Railway Dashboard:
- `PORT`: 4173 (ou deixe o Railway definir automaticamente)
- `VITE_API_URL`: URL da sua API backend

## Estrutura de Arquivos

Os arquivos `railway.json` já estão configurados corretamente:
- `backend/railway.json` - Configuração do backend
- `frontend/railway.json` - Configuração do frontend

## Comandos Importantes

```bash
# Ver logs do deploy
railway logs

# Ver status do serviço
railway status

# Abrir no navegador
railway open

# Conectar ao shell do Railway
railway shell
```

## Troubleshooting

1. **Erro de porta**: Certifique-se de que a variável `PORT` está configurada
2. **Erro de build**: Verifique se todas as dependências estão no `package.json`
3. **Erro de conexão com banco**: Verifique se a `MONGODB_URI` está correta
4. **Erro de CORS**: Configure o CORS no backend para aceitar o domínio do frontend

## Migração para MongoDB

O projeto foi migrado de MySQL/Sequelize para MongoDB/Mongoose:
- ✅ Modelos convertidos para Mongoose
- ✅ Rotas atualizadas para usar MongoDB
- ✅ Middleware de autenticação atualizado
- ✅ Configuração de conexão atualizada 