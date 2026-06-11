# presentation-api

API para consumir dados de apresentação pessoal

## Instalação

```bash
pnpm install
```

## Variáveis de ambiente

```bash
cp .env.example .env
```

## Banco de dados local (MongoDB)

```bash
docker compose up -d
```

## Compilação e execução

```bash
# executar em modo de desenvolvimento
pnpm run start:dev

# gerar build
pnpm run build

# executar build
pnpm run start:prod
```

## Testes

```bash
# testes e2e
pnpm run test:e2e
```
