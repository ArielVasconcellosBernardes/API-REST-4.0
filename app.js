const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swaggerDef');
const apiRoutes = require('./src/routes/apiRoutes');
const authRoutes = require('./src/routes/authRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const produtosRoutes = require('./src/routes/produtosRoutes');
const clientesRoutes = require('./src/routes/clientesRoutes');
const pedidosRoutes = require('./src/routes/pedidosRoutes');
const { sanitizeInput, rateLimiter } = require('./src/middleware/sanitize');

const app = express();

// Documentação interativa da API (Swagger UI).
// Montada antes do helmet() para que o Content-Security-Policy padrão
// não bloqueie os assets (CSS/JS) carregados pela própria interface do Swagger.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Loja API - Documentacao'
}));

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(sanitizeInput);

app.use(rateLimiter(100, 60000));

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/pedidos', pedidosRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
