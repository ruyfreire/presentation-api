# presentation-api

API NestJS que serve os dados do meu [currículo vivo](https://presentation-nextjs-eta.vercel.app).

## Tecnologias

- NestJS
- TypeScript
- Mongoose
- Zod
- Passport JWT
- bcrypt
- CSRF-CSRF
- CORS
- Helmet
- Throttler
- Swagger
- Jest
- Supertest
- New Relic
- ESLint
- Prettier
- Husky
- Docker

## Arquitetura

- [Arquitetura](./ARCHITECTURE.md)

## Instalação

```bash
pnpm install
```

## Variáveis de ambiente

```bash
cp .env.example .env
```

| Variável                    | Descrição                                           | Obrigatório |
| --------------------------- | --------------------------------------------------- | ----------- |
| `PORT` / `HOST`             | Porta e host que o Nest sobe                        | Não         |
| `MONGODB_URI`               | URI de conexão com o banco                          | Sim         |
| `JWT_SECRET`                | Secret para o token JWT                             | Sim         |
| `CSRF_SECRET`               | Secret para o CSRF token                            | Sim         |
| `COOKIE_EXPIRES_MS`         | Validade do JWT e do cookie, em milissegundos       | Não         |
| `CORS_ORIGINS`              | String de origens permitidas, separadas por vírgula | Sim         |
| `NEW_RELIC_CONFIG_FILENAME` | Nome do arquivo de configuração do New Relic        | Não         |
| `NEW_RELIC_APP_NAME`        | Nome da aplicação no New Relic                      | Não         |
| `NEW_RELIC_LICENSE_KEY`     | Chave de licença do New Relic                       | Não         |

_New Relic só carrega em produção, as envs_ `NEW_RELIC_` _são ignoradas em desenvolvimento._

## Banco de dados local (MongoDB)

```bash
docker compose up -d
```

## Desenvolvimento

```bash
pnpm start:dev
```

A API sobe em [http://localhost:4000](http://localhost:4000). A documentação local fica em [http://localhost:4000/docs](http://localhost:4000/docs)

## Compilação e execução

```bash
# gerar build
pnpm build

# executar build (com New Relic)
pnpm start:prod
```

## Testes

```bash
# testes e2e (repositório em memória, sem Mongo)
pnpm test:e2e
```

## Lint

```bash
pnpm type-check
pnpm lint:check
pnpm format:check
```
