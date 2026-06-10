# presentation-api

API para consumir dados de apresentação pessoal

## Instalação

```bash
pnpm install
```

## Compilação e execução

```bash
# modo de desenvolvimento
pnpm run start

# modo de desenvolvimento watch
pnpm run start:dev

# modo de produção
pnpm run start:prod
```

## Testes

```bash
# testes unitários
pnpm run test

# testes e2e
pnpm run test:e2e

# cobertura de testes
pnpm run test:cov
```

src/
├── config/                     # Configurações globais (env, database, R2)
│   ├── configuration.ts
│   └── database.config.ts
├── database/                   # Infraestrutura global de banco de dados
│   ├── database.module.ts      # Gerencia a conexão com Mongoose/Atlas
│   └── mongoose-config.service.ts
├── shared/                     # Código compartilhado entre módulos (pipes, interceptors)
│   └── filters/
│       └── http-exception.filter.ts
├── modules/                    # Onde ficam as features/domínios do sistema
│   └── profile/                # Exemplo: Módulo de Currículo/Perfil
│       ├── controllers/
│       │   └── profile.controller.ts
│       ├── services/
│       │   └── profile.service.ts
│       ├── repositories/        # Abstração do banco de dados
│       │   ├── profile.repository.interface.ts
│       │   └── mongoose/
│       │       ├── profile.mongoose.repository.ts
│       │       └── profile.schema.ts
│       ├── dtos/
│       │   ├── create-profile.dto.ts
│       │   └── update-profile.dto.ts
│       ├── tests/
│       │   ├── profile.service.spec.ts
│       │   └── profile.controller.spec.ts
│       └── profile.module.ts
├── app.module.ts               # Módulo raiz que orquestra tudo
└── main.ts                     # Arquivo de inicialização (bootstrap)