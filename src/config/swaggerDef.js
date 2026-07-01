const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Loja API',
      version: '2.0.0',
      description: 'API REST de loja com autenticacao JWT, MySQL e CRUD protegido.'
    },
    servers: [
      {
        url: 'http://localhost:{port}',
        description: 'Servidor local',
        variables: {
          port: {
            default: '3000'
          }
        }
      }
    ],
    tags: [
      { name: 'Status', description: 'Rotas publicas de monitoramento' },
      { name: 'Autenticacao', description: 'Cadastro, login e perfil do usuario' },
      { name: 'Loja', description: 'CRUD de categorias, produtos, clientes e pedidos' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: []
};

module.exports = swaggerJsdoc(options);
