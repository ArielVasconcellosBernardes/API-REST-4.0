# Loja API REST

API REST de loja feita com Node.js, Express, JWT e MySQL.

## Recursos

- Conexao MySQL com `mysql2/promise`
- Credenciais via `.env`
- Prepared statements em todas as queries SQL
- Login com JWT
- Endpoint publico de status
- CRUD protegido de categorias, produtos, clientes e pedidos

## Instalacao

```bash
npm install
```

Crie o arquivo `.env` com base no `.env.example`:

```env
PORT=3000
JWT_SECRET=troque_essa_chave
BCRYPT_ROUNDS=10
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=loja
DB_CONNECTION_LIMIT=10
```

Importe o banco:

```bash
mysql -u root -p < loja.sql
```

Inicie a API:

```bash
npm run dev
```

## Rotas

Rotas publicas:

- `GET /api/status`
- `GET /api/versao`
- `POST /api/auth/login`
- `POST /api/auth/register`

Rotas privadas:

- `/api/categorias`
- `/api/produtos`
- `/api/clientes`
- `/api/pedidos`

Nas rotas privadas envie:

- `Authorization: Bearer <token>`
- `x-user-id: <id-do-usuario>`

O `x-user-id` precisa ser igual ao ID que esta dentro do token.

## Usuario de teste

O `loja.sql` cria um usuario inicial:

- Email: `admin@loja.com`
- Senha: `senha123`

Exemplo de login:

```json
{
  "email": "admin@loja.com",
  "password": "senha123"
}
```

Exemplo de categoria:

```json
{
  "nome": "Eletronicos",
  "descricao": "Produtos eletronicos e acessorios"
}
```
