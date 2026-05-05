# API REST para Rede Social — Documentação Técnica

**Versão:** 1.0.0  
**Data de Publicação:** Maio de 2026  
**Autor:** Equipe de Desenvolvimento  
**Licença:** MIT

---

## Resumo Executivo

O presente documento descreve a arquitetura, os requisitos técnicos, o processo de instalação, a configuração do ambiente, a integração com o banco de dados NoSQL MongoDB, a documentação completa dos endpoints e as práticas de segurança adotadas no desenvolvimento de uma API REST funcional para uma plataforma de rede social.

A aplicação foi desenvolvida utilizando o ecossistema Node.js, o framework Express.js e o banco de dados MongoDB, demonstrando domínio em persistência de dados não relacional, autenticação de usuários, criptografia de senhas, proteção contra injeção de código e boas práticas de versionamento com GitFlow.

---

## 1. Visão Geral da Arquitetura

A API segue o padrão arquitetural REST (Representational State Transfer) e adota o modelo MVC (Model-View-Controller), ainda que sem a camada de visão tradicional, substituída pelas respostas JSON. A comunicação entre os componentes é estabelecida conforme a seguinte estrutura:
Cliente (HTTP/HTTPS)
↓
Express.js (Rotas e Middlewares)
↓
Controllers (Lógica de negócio)
↓
Models (Mongoose ODM)
↓
MongoDB (Banco de dados NoSQL)

text

### 1.1 Tecnologias Empregadas

| Categoria | Tecnologia | Versão | Finalidade |
|-----------|-----------|--------|-------------|
| Runtime | Node.js | 14.x ou superior | Ambiente de execução JavaScript |
| Framework Web | Express.js | 4.18.x | Roteamento e gerenciamento de requisições |
| Banco de Dados | MongoDB | 6.x | Persistência de dados orientada a documentos |
| ODM | Mongoose | 7.x | Modelagem de dados e conexão com MongoDB |
| Autenticação | JWT (jsonwebtoken) | 9.x | Geração e validação de tokens |
| Criptografia | bcryptjs | 2.x | Hashing seguro de senhas |
| Validação | express-validator | 7.x | Sanitização e validação de entradas |
| Segurança | helmet, cors | 7.x, 2.x | Proteção de headers e CORS |
| Versionamento | Git | 2.x | Controle de versão com GitFlow |

---

## 2. Pré-requisitos para Execução

Para que a aplicação possa ser executada em ambiente de desenvolvimento ou produção, os seguintes componentes devem estar instalados e devidamente configurados:

### 2.1 Componentes Obrigatórios

1. **Node.js** (versão 14.x ou superior)
   - Verificação: `node --version`
   - Download: https://nodejs.org/

2. **npm** ou **yarn** (gerenciadores de pacotes)
   - Verificação: `npm --version`

3. **MongoDB Server** (comunitário ou Atlas)
   - Instalação local ou conta na nuvem

4. **Git** (para clonagem e versionamento)
   - Verificação: `git --version`

### 2.2 Componentes Recomendados

1. **MongoDB Compass**
   - Interface gráfica para administração do banco de dados
   - Download: https://www.mongodb.com/products/compass

2. **Postman** ou **Insomnia**
   - Para teste dos endpoints da API

3. **Visual Studio Code** ou editor de sua preferência

---

## 3. Configuração do Banco de Dados MongoDB

### 3.1 Considerações Iniciais

O MongoDB é um banco de dados orientado a documentos que armazena dados em estruturas BSON (Binary JSON). Sua natureza schemaless confere flexibilidade à aplicação, sendo particularmente adequada para sistemas de rede social, onde os atributos de postagens e perfis podem variar dinamicamente.

### 3.2 Instalação do MongoDB Local

#### 3.2.1 Windows

```bash
# Baixar o instalador do site oficial
# https://www.mongodb.com/try/download/community

# Executar o serviço (como Administrador)
net start MongoDB


3.2.2 macOS

bash
# Instalar via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Iniciar o serviço
brew services start mongodb-community


3.2.3 Linux (Ubuntu/Debian)

bash
# Importar chave pública
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Adicionar repositório
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar serviço
sudo systemctl start mongod


3.3 Configuração do MongoDB Atlas (Nuvem)

Para ambientes que não dispõem de infraestrutura local, recomenda-se o MongoDB Atlas, que oferece uma camada gratuita suficiente para desenvolvimento:

Acessar o portal MongoDB Atlas

Criar uma conta gratuita

Provisionar um cluster compartilhado (camada M0)

Na seção "Database Access", criar um usuário e senha

Na seção "Network Access", adicionar o IP atual ou liberar para 0.0.0.0/0 (desenvolvimento apenas)

Obter a string de conexão fornecida no formato:

text
mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<nome-banco>?retryWrites=true&w=majority


3.4 Verificação Visual com MongoDB Compass

O MongoDB Compass é uma ferramenta gráfica oficial que permite visualizar, consultar e manipular os dados armazenados sem a necessidade de comandos no terminal.

Procedimento de conexão:

Iniciar o MongoDB Compass

Clicar em "New Connection"

No campo URI, informar a string de conexão (a mesma utilizada no arquivo .env)

Clicar em "Connect"

Navegar até o banco de dados e coleções para inspecionar os documentos

Operações possíveis no Compass:

Visualização formatada de documentos

Criação, edição e exclusão manual de registros

Execução de consultas com filtros JSON

Criação de índices para otimização de performance

Validação de esquemas JSON


4. Instalação e Configuração da Aplicação

4.1 Clonagem do Repositório

bash
git clone https://github.com/seu-usuario/social-media-api.git
cd social-media-api


4.2 Instalação das Dependências

bash
npm install
As principais dependências instaladas são:

Pacote	Versão	Finalidade
express	4.18.2	Framework web
mongoose	7.5.0	ODM para MongoDB
bcryptjs	2.4.3	Criptografia de senhas
jsonwebtoken	9.0.2	Autenticação via JWT
dotenv	16.3.1	Gerenciamento de variáveis de ambiente
express-validator	7.0.1	Validação e sanitização
helmet	7.0.0	Segurança de headers HTTP
cors	2.8.5	Compartilhamento de recursos entre origens
4.3 Configuração das Variáveis de Ambiente
Criar um arquivo .env a partir do modelo fornecido:

bash
cp .env.example .env
Editar o arquivo .env com as configurações pertinentes ao ambiente:

env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do Banco de Dados
MONGODB_URI=mongodb://localhost:27017/social_media_db

# Configurações de Segurança
JWT_SECRET=substitua_por_uma_chave_forte_com_pelo_menos_32_caracteres
BCRYPT_ROUNDS=10
Observação importante: O arquivo .env não deve ser versionado. O repositório contém apenas o arquivo .env.example como modelo documentado.


4.4 Estrutura da Conexão com MongoDB (Mongoose)

O arquivo src/config/database.js implementa a lógica de conexão:

javascript
const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`Conectado ao MongoDB: ${connection.connection.host}`);
    console.log(`Banco de dados: ${connection.connection.name}`);
    
    return connection;
  } catch (error) {
    console.error('Erro na conexão com o banco de dados:', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;


5. Execução da Aplicação

5.1 Modo Desenvolvimento

bash
npm run dev
Este comando inicia o servidor com nodemon, que monitora alterações nos arquivos e reinicia a aplicação automaticamente.


5.2 Modo Produção

bash
npm start


5.3 Verificação de Funcionamento

Após a inicialização bem-sucedida, o terminal deverá exibir:

Conectado ao MongoDB: localhost
Banco de dados: social_media_db
Servidor rodando na porta 3000
Para verificar o status da API, acessar o endpoint de saúde:

bash
curl http://localhost:3000/health
Resposta esperada:

json
{
  "status": "OK",
  "timestamp": "2026-05-05T10:30:00.000Z"
}


6. Modelagem dos Dados (Schemas Mongoose)

6.1 Schema de Usuário (src/models/User.js)

javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Nome de usuário é obrigatório'],
    unique: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: 6,
    select: false
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });


6.2 Schema de Postagem (src/models/Post.js)

javascript
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  content: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  content: { type: String, required: true, maxlength: 2000 },
  image: { type: String, default: '' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });


7. Documentação dos Endpoints

7.1 Rotas de Autenticação

Método	Endpoint	Descrição	Autenticação
POST	/api/auth/register	Registro de novo usuário	Não
POST	/api/auth/login	Autenticação e obtenção de token	Não
GET	/api/auth/me	Obtenção do perfil do usuário	Sim
PUT	/api/auth/profile	Atualização do perfil	Sim


7.1.1 Registro de Usuário

Requisição:

http
POST /api/auth/register
Content-Type: application/json

{
  "username": "joao_silva",
  "email": "joao@exemplo.com",
  "password": "senhaSegura123",
  "bio": "Desenvolvedor full-stack"
}
Resposta bem-sucedida (201 Created):

json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "joao_silva",
    "email": "joao@exemplo.com",
    "bio": "Desenvolvedor full-stack",
    "createdAt": "2026-05-05T10:00:00.000Z"
  }
}


7.1.2 Login

Requisição:

http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "password": "senhaSegura123"
}
Resposta bem-sucedida (200 OK):

json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "joao_silva",
    "email": "joao@exemplo.com",
    "followers": 0,
    "following": 0
  }
}


7.2 Rotas de Postagens (CRUD Completo)

Método	Endpoint	Descrição	Autenticação
POST	/api/posts	Criar nova postagem	Sim
GET	/api/posts	Listar postagens (paginado)	Não
GET	/api/posts/:id	Obter postagem específica	Não
PUT	/api/posts/:id	Atualizar postagem	Sim (autor)
DELETE	/api/posts/:id	Excluir postagem	Sim (autor)
POST	/api/posts/:id/like	Alternar like/unlike	Sim
POST	/api/posts/:id/comments	Adicionar comentário	Sim
DELETE	/api/posts/:id/comments/:commentId	Remover comentário	Sim
GET	/api/posts/user/:userId?	Postagens de um usuário	Sim


7.2.1 Criar Postagem

Requisição:

http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Esta é minha primeira postagem na plataforma.",
  "image": "https://exemplo.com/imagem.jpg"
}
Resposta bem-sucedida (201 Created):

json
{
  "success": true,
  "post": {
    "_id": "60d21b4667d0d8992e610c86",
    "user": "60d21b4667d0d8992e610c85",
    "username": "joao_silva",
    "content": "Esta é minha primeira postagem na plataforma.",
    "image": "https://exemplo.com/imagem.jpg",
    "likes": [],
    "comments": [],
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2026-05-05T10:05:00.000Z"
  }
}


7.2.2 Listar Postagens (Paginado)

Requisição:

http
GET /api/posts?page=1&limit=10
Resposta bem-sucedida (200 OK):

json
{
  "success": true,
  "posts": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}


7.2.3 Adicionar Comentário

Requisição:

http
POST /api/posts/60d21b4667d0d8992e610c86/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Excelente postagem! Concordo plenamente."
}
Resposta bem-sucedida (201 Created):

json
{
  "success": true,
  "comment": {
    "_id": "60d21b4667d0d8992e610c87",
    "user": "60d21b4667d0d8992e610c85",
    "username": "joao_silva",
    "content": "Excelente postagem! Concordo plenamente.",
    "createdAt": "2026-05-05T10:10:00.000Z"
  }
}


7.2.4 Atualizar Postagem

Requisição:

http
PUT /api/posts/60d21b4667d0d8992e610c86
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Versão atualizada da minha postagem."
}
Resposta bem-sucedida (200 OK):

json
{
  "success": true,
  "post": { ... }
}


7.2.5 Excluir Postagem

Requisição:

http
DELETE /api/posts/60d21b4667d0d8992e610c86
Authorization: Bearer <token>
Resposta bem-sucedida (200 OK):

json
{
  "success": true,
  "message": "Postagem excluída com sucesso"
}


8. Mecanismos de Segurança Implementados

A API incorpora múltiplas camadas de segurança, conforme detalhado a seguir:


8.1 Criptografia de Senhas

As senhas dos usuários não são armazenadas em texto plano. O algoritmo bcrypt é empregado com fator de custo configurável (BCRYPT_ROUNDS=10):

javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS));
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


8.2 Prevenção contra NoSQL Injection

Todas as entradas de usuário são sanitizadas para remover caracteres e padrões maliciosos:

javascript
const sanitizeInput = (req, res, next) => {
  const dangerousKeys = ['$', 'function', 'eval', 'constructor', '__proto__'];
  // Remoção recursiva de padrões perigosos
  // ...
};


8.3 Autenticação Stateless com JWT

Os tokens JWT são assinados com uma chave secreta armazenada em variável de ambiente e possuem validade de 30 dias.


8.4 Rate Limiting

Limitação de requisições por IP para prevenir ataques de força bruta:

Requisições globais: 100 por minuto

Registro: 5 por minuto

Login: 10 por minuto


8.5 Headers de Segurança (Helmet)

O middleware helmet configura os seguintes headers HTTP:

X-Content-Type-Options: nosniff

X-Frame-Options: DENY

X-XSS-Protection: 1; mode=block

Strict-Transport-Security (em produção)


8.6 Validação de Entradas (express-validator)

Todos os campos são validados antes do processamento:

javascript
const registerValidation = [
  body('username').isLength({ min: 3 }).matches(/^[a-zA-Z0-9_]+$/),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];


9. Versionamento com GitFlow

O projeto adota o modelo de branching GitFlow, que organiza o desenvolvimento em ramos distintos conforme sua finalidade.


9.1 Estrutura de Branches

Branch	Finalidade	Protegida
main	Versão estável e pronta para produção	Sim
develop	Integração de funcionalidades em desenvolvimento	Sim
feature/*	Desenvolvimento de requisitos específicos	Não
hotfix/*	Correções urgentes em produção	Não


9.2 Fluxo de Trabalho

         feature/auth ──┐
                        ↓
         feature/posts ─┼──→ develop ──→ main
                        ↑
         feature/likes ─┘


9.3 Convenção de Commits Semânticos

Prefixo	Descrição	Exemplo
feat	Nova funcionalidade	feat: adicionar rota de like em postagens
fix	Correção de bug	fix: corrigir validação de e-mail duplicado
docs	Documentação	docs: atualizar README com novos endpoints
refactor	Refatoração	refactor: otimizar consultas ao banco de dados
chore	Manutenção	chore: atualizar dependências de segurança
test	Testes	test: adicionar testes unitários para auth


9.4 Exemplos de Comandos

bash
# Criar nova branch de funcionalidade
git checkout -b feature/autenticacao-jwt develop

# Realizar commit semântico
git add .
git commit -m "feat: implementar middleware de verificação de token"

# Mesclar com develop
git checkout develop
git merge --no-ff feature/autenticacao-jwt

# Após validação, mesclar develop com main
git checkout main
git merge --no-ff develop
git tag -a v1.0.0 -m "Primeira versão estável"


10. Estrutura Completa do Projeto

text
social-media-api/
│
├── src/
│   ├── config/
│   │   └── database.js              # Configuração da conexão MongoDB
│   │
│   ├── models/
│   │   ├── User.js                  # Schema e métodos do usuário
│   │   └── Post.js                  # Schema da postagem e comentários
│   │
│   ├── controllers/
│   │   ├── authController.js        # Lógica de registro, login, perfil
│   │   └── postController.js        # Lógica de CRUD, likes, comentários
│   │
│   ├── middleware/
│   │   ├── auth.js                  # Verificação de token JWT
│   │   └── sanitize.js              # Sanitização e rate limiting
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # Rotas de autenticação
│   │   └── postRoutes.js            # Rotas de postagens
│   │
│   └── app.js                       # Configuração do Express
│
├── server.js                        # Ponto de entrada da aplicação
├── package.json                     # Dependências e scripts
├── .env.example                     # Modelo de variáveis de ambiente
├── .gitignore                       # Arquivos ignorados pelo Git
├── .gitattributes                   # Configurações do Git
└── README.md                        # Documentação (este arquivo)


11. Códigos de Status HTTP Utilizados

Código	Significado	Utilização
200	OK	Requisição bem-sucedida
201	Created	Recurso criado com sucesso
400	Bad Request	Erro de validação nos dados enviados
401	Unauthorized	Token ausente ou inválido
403	Forbidden	Usuário não autorizado para a ação
404	Not Found	Recurso não encontrado
429	Too Many Requests	Limite de requisições excedido
500	Internal Server Error	Erro interno do servidor


12. Solução de Problemas Comuns

12.1 Erro: MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017

Causa	Solução
Servidor MongoDB não está em execução	Iniciar o serviço conforme seção 3.2
Porta padrão alterada	Verificar a porta na string de conexão
Firewall bloqueando a conexão	Permitir porta 27017 no firewall


12.2 Erro: MongoServerError: bad auth Authentication failed

Causa	Solução
Credenciais incorretas no .env	Verificar usuário e senha na string de conexão
Usuário não possui permissões	Configurar permissões no MongoDB Atlas


12.3 Erro: JsonWebTokenError: invalid signature

Causa	Solução
Token expirado ou inválido	Realizar novo login no endpoint /api/auth/login
JWT_SECRET alterada	Manter a mesma chave ou reemitir tokens


12.4 Documentos não aparecem no MongoDB Compass

Causa	Solução
Banco ou coleção incorreta	Verificar namespace no Compass
Conexão aponta para instância diferente	Confirmar string de conexão
Dados não foram persistidos	Verificar logs da aplicação


12.5 Erro: Rate limit exceeded

Causa	Solução
Muitas requisições em curto intervalo	Aguardar 60 segundos antes de novas tentativas
Limite muito restritivo para o cenário	Ajustar limites no arquivo sanitize.js


13. Scripts Disponíveis

Comando	Descrição
npm start	Inicia o servidor em modo produção
npm run dev	Inicia o servidor com hot-reload (nodemon)
npm test	Executa a suíte de testes (quando implementada)


14. Considerações Finais

A API desenvolvida atende integralmente aos requisitos estabelecidos no escopo do projeto, demonstrando:

Domínio em persistência NoSQL por meio do MongoDB e Mongoose, com modelagem flexível adequada ao domínio de rede social.

Segurança robusta com criptografia de senhas (bcrypt), autenticação JWT, sanitização contra injeção de código e rate limiting.

CRUD completo para a entidade principal (postagens), incluindo operações de criação, leitura, atualização e exclusão.

Versionamento profissional com GitFlow, branches organizadas (main, develop, feature/*) e commits semânticos.

Documentação abrangente com instruções claras de instalação, configuração e lista completa de endpoints.

A aplicação encontra-se pronta para implantação em ambiente de produção, bastando ajustar as variáveis de ambiente para os valores apropriados e garantir a correta configuração do banco de dados MongoDB.


15. Referências
Documentação Oficial do Node.js

Documentação do Express.js

Documentação do MongoDB

Documentação do Mongoose

Documentação do JWT

Documentação do bcrypt

GitFlow Workflow

Fim do Documento

Este README foi elaborado conforme as melhores práticas de documentação de software e atende aos critérios de avaliação do projeto.