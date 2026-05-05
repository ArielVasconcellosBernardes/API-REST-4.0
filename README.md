# API de Rede Social - Trabalho Escolar

Uma API simples de rede social desenvolvida com Node.js, Express e MongoDB para fins educacionais.

## Autor

Ariel Vasconcellos Bernardes
05/05/2026

## Sobre o Projeto

Este projeto é uma API REST que simula funcionalidades básicas de uma rede social, como:

- Cadastro e login de usuários
- Criação, leitura, atualização e exclusão de postagens (CRUD completo)
- Curtir e comentar em postagens
- Perfil de usuário

Foi desenvolvido como trabalho para disciplina de Desenvolvimento de APIs.

## Tecnologias Utilizadas

| Tecnologia | O que faz |
|------------|-----------|
| Node.js | Executa o JavaScript no servidor |
| Express | Framework para criar as rotas da API |
| MongoDB | Banco de dados onde guardamos as informações |
| Mongoose | Conecta o Node.js com o MongoDB |
| JWT | Faz a autenticação dos usuários |
| bcryptjs | Criptografa as senhas |
| dotenv | Gerencia as configurações sensíveis |

## Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [MongoDB](https://www.mongodb.com/try/download/community) (instalação local)
- [Git](https://git-scm.com/) (opcional, para clonar o repositório)

## Como instalar e executar

### Passo 1: Baixar o projeto

Se você tem Git:
```bash
git clone https://github.com/seu-usuario/social-media-api.git
cd social-media-api
Ou baixe o ZIP do projeto e extraia em uma pasta.

Passo 2: Instalar as dependências
bash
npm install

Passo 3: Configurar o banco de dados
Primeiro, inicie o MongoDB no seu computador:

Windows (como Administrador):

bash
net start MongoDB
macOS:

bash
brew services start mongodb-community
Linux:

bash
sudo systemctl start mongod

Passo 4: Configurar as variáveis de ambiente
Crie um arquivo .env na pasta raiz do projeto com o seguinte conteúdo:

env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/social_media_db
JWT_SECRET=minha_chave_secreta_aqui
BCRYPT_ROUNDS=10

Passo 5: Rodar a aplicação
bash
npm run dev
Você verá no terminal:

Conectado ao MongoDB: localhost
Servidor rodando na porta 3000
Endpoints da API
Autenticação
Método	Endpoint	O que faz
POST	/api/auth/register	Cadastrar novo usuário
POST	/api/auth/login	Fazer login
GET	/api/auth/me	Ver meus dados (precisa de token)
PUT	/api/auth/profile	Atualizar meu perfil (precisa de token)
Postagens
Método	Endpoint	O que faz
POST	/api/posts	Criar postagem (precisa de token)
GET	/api/posts	Listar todas postagens
GET	/api/posts/:id	Ver uma postagem específica
PUT	/api/posts/:id	Editar postagem (só o dono)
DELETE	/api/posts/:id	Deletar postagem (só o dono)
POST	/api/posts/:id/like	Curtir/descurtir postagem (precisa de token)
POST	/api/posts/:id/comments	Comentar em postagem (precisa de token)
 Exemplos de uso


1. Cadastrar um usuário
Requisição:

bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "joao",
    "email": "joao@email.com",
    "password": "123456"
  }'
Resposta:

json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "joao",
    "email": "joao@email.com"
  }
}


2. Fazer login
Requisição:

bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
Resposta:

json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}


3. Criar uma postagem (precisa do token)
Requisição:

bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Minha primeira postagem!"
  }'


4. Ver todas as postagens
Requisição:

bash
curl -X GET http://localhost:3000/api/posts


5. Curtir uma postagem
Requisição:

bash
curl -X POST http://localhost:3000/api/posts/ID_DA_POSTAGEM/like \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"


6. Comentar em uma postagem
Requisição:

bash
curl -X POST http://localhost:3000/api/posts/ID_DA_POSTAGEM/comments \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Que legal essa postagem!"
  }'


 Estrutura do Projeto
text
social-media-api/
├── src/
│   ├── config/          # Configuração do banco de dados
│   ├── models/          # Esquemas do MongoDB (User, Post)
│   ├── controllers/     # Lógica das rotas
│   ├── middleware/      # Autenticação e sanitização
│   └── routes/          # Definição dos endpoints
├── .env.example         # Exemplo de variáveis de ambiente
├── .gitignore           # Arquivos ignorados pelo Git
├── package.json         # Dependências e scripts
└── server.js            # Arquivo principal


Segurança implementada
Para este trabalho escolar, foram aplicadas medidas básicas de segurança:

Senhas são criptografadas com bcrypt
Autenticação com JWT (token)
Proteção contra injeção de código no banco
Validação dos dados de entrada
Limitação de requisições (evita ataques)


Possíveis problemas e soluções
Problema	                            O que fazer
"MongoNetworkError"     	            O MongoDB não está rodando. Inicie o serviço.
"Bad auth"              	            Verifique se o usuário/senha do banco estão corretos
Token inválido          	            Faça login novamente para gerar um novo token
Porta 3000 já está sendo usada      	Mude a porta no arquivo .env


Scripts disponíveis
bash
npm run dev   # Roda o projeto em modo desenvolvimento
npm start     # Roda o projeto em modo produção