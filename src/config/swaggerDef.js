const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

/**
 * Definição central do OpenAPI/Swagger.
 *
 * Este arquivo NÃO contém nenhuma lógica de negócio. Ele apenas descreve
 * o contrato da API (metadados, segurança e schemas) e diz ao swagger-jsdoc
 * onde encontrar os comentários @openapi que descrevem cada rota
 * (pasta src/docs/*.docs.js).
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social API',
      version: '1.0.0',
      description:
        'Documentação interativa da API REST (autenticação de usuários e publicações/posts). ' +
        'Gerada automaticamente a partir de comentários OpenAPI com swagger-jsdoc.',
      contact: {
        name: 'Equipe de Desenvolvimento'
      }
    },
    servers: [
      {
        url: 'http://localhost:{port}',
        description: 'Servidor local de desenvolvimento',
        variables: {
          port: {
            default: '3000'
          }
        }
      }
    ],
    tags: [
      { name: 'Autenticação', description: 'Cadastro, login e gerenciamento de perfil do usuário' },
      { name: 'Posts', description: 'Criação, listagem, edição, curtidas e comentários em publicações' },
      { name: 'Status', description: 'Verificação de saúde (health check) da API' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT retornado por /api/auth/register ou /api/auth/login. Envie como "Authorization: Bearer {token}".'
        }
      },
      schemas: {
        // ---------- Usuário ----------
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            username: { type: 'string', example: 'joaosilva' },
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            bio: { type: 'string', example: 'Desenvolvedor apaixonado por tecnologia' },
            avatar: { type: 'string', example: 'https://exemplo.com/avatar.jpg' },
            followers: {
              type: 'integer',
              description: 'Quantidade de seguidores (na rota /me retorna lista populada)',
              example: 12
            },
            following: {
              type: 'integer',
              description: 'Quantidade de usuários seguidos (na rota /me retorna lista populada)',
              example: 8
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              pattern: '^[a-zA-Z0-9_]+$',
              example: 'joaosilva'
            },
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            password: { type: 'string', format: 'password', minLength: 6, example: 'senha123' },
            bio: { type: 'string', maxLength: 500, example: 'Olá, sou novo por aqui!' }
          }
        },

        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            password: { type: 'string', format: 'password', example: 'senha123' }
          }
        },

        UpdateProfileRequest: {
          type: 'object',
          properties: {
            bio: { type: 'string', maxLength: 500, example: 'Bio atualizada' },
            avatar: { type: 'string', example: 'https://exemplo.com/novo-avatar.jpg' }
          }
        },

        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/User' }
          }
        },

        MeResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            user: { $ref: '#/components/schemas/User' }
          }
        },

        // ---------- Posts ----------
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0e2' },
            user: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            username: { type: 'string', example: 'joaosilva' },
            content: { type: 'string', example: 'Muito bom esse post!' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        CreateCommentRequest: {
          type: 'object',
          required: ['content'],
          properties: {
            content: { type: 'string', minLength: 1, maxLength: 500, example: 'Muito bom esse post!' }
          }
        },

        Post: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0f3' },
            user: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            username: { type: 'string', example: 'joaosilva' },
            content: { type: 'string', example: 'Meu primeiro post na rede!' },
            image: { type: 'string', example: 'https://exemplo.com/foto.jpg' },
            likes: {
              type: 'array',
              items: { type: 'string' },
              example: ['64f1a2b3c4d5e6f7a8b9c0d1']
            },
            likesCount: { type: 'integer', example: 3 },
            comments: {
              type: 'array',
              items: { $ref: '#/components/schemas/Comment' }
            },
            commentsCount: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        CreatePostRequest: {
          type: 'object',
          required: ['content'],
          properties: {
            content: { type: 'string', minLength: 1, maxLength: 2000, example: 'Meu primeiro post na rede!' },
            image: { type: 'string', format: 'uri', example: 'https://exemplo.com/foto.jpg' }
          }
        },

        UpdatePostRequest: {
          type: 'object',
          properties: {
            content: { type: 'string', minLength: 1, maxLength: 2000, example: 'Conteúdo editado do post' },
            image: { type: 'string', format: 'uri', example: 'https://exemplo.com/foto-nova.jpg' }
          }
        },

        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 42 },
            pages: { type: 'integer', example: 5 }
          }
        },

        PostListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            posts: {
              type: 'array',
              items: { $ref: '#/components/schemas/Post' }
            },
            pagination: { $ref: '#/components/schemas/Pagination' }
          }
        },

        PostResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            post: { $ref: '#/components/schemas/Post' }
          }
        },

        LikeResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            likes: { type: 'integer', example: 4 },
            isLiked: { type: 'boolean', example: true }
          }
        },

        CommentResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            comment: { $ref: '#/components/schemas/Comment' }
          }
        },

        // ---------- Genéricos ----------
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem descrevendo o erro' }
          }
        },

        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', example: 'field' },
                  msg: { type: 'string', example: 'Username must be 3-30 characters' },
                  path: { type: 'string', example: 'username' },
                  location: { type: 'string', example: 'body' }
                }
              }
            }
          }
        }
      }
    }
  },
  // Onde o swagger-jsdoc deve procurar os comentários @openapi de cada rota.
  apis: [path.join(__dirname, '..', 'docs', '*.docs.js')]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;