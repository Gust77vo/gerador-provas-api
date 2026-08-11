# Contrato do template — gerador-provas-api (2026)

Este documento é a **fonte da verdade** dos exercícios. As aulas em `26aulas/` referenciam os caminhos e testes abaixo.

## Papéis

| Quem | Implementa |
|------|------------|
| Professor (demo) | `User` — CRUD, auth, upload v2, Swagger v2 |
| Aluno (exercício) | `Subject` + `Question` — espelhar o padrão de Users |

## Estrutura

```
26repo/
├── src/
│   ├── app.js                 # Express app (sem listen) — usado nos testes
│   ├── server.js              # sobe o servidor
│   ├── config/
│   ├── errors/
│   ├── middlewares/
│   └── api/v1/ … v2/
├── tests/
│   ├── unit/                  # services com vi.mock
│   ├── integration/           # rotas + Supertest
│   └── contract/              # v1 inalterada após mudanças na v2
├── bruno/                     # coleção pronta
└── .github/workflows/ci.yml   # escada: smoke → test
```

## Convenção Objetivo + Descrição

Todo stub e artefato de código declara no cabeçalho:

```js
/**
 * Objetivo: <o que resolve>
 * Descrição: <papel na arquitetura>
 */
```

## Progressão por aula

| Aula | O que o aluno faz no template | Critério de pronto |
|------|-------------------------------|--------------------|
| 2 | Criar `GET /api/v1/status`; entender pastas | smoke CI ✅; Bruno health |
| 3 | Completar models Subject/Question no schema (se stub); migrate | Prisma Studio ok |
| 4 | Implementar GET/POST Subject (stubs em controller/service) | `tests/integration/subjects.test.js` (GET/POST) ✅ |
| 5 | PUT/DELETE + services Subject/Question; seguir UserService | integration subjects+questions ✅ |
| 6 | Schemas Zod Subject/Question + errors | 400/404 Bruno + testes |
| 7 | Auditar prefixo `/api/v1` | Bruno baseUrl |
| 8 | Contract tests v1; espelhar se houver testes Subject v2 | `tests/contract/` ✅ |
| 9 | DELETE upload ciclo de vida; Question `imagemUrl` | unit upload mock + contract v1 |
| 10 | Anotações `@swagger` da **v1** | `/api-docs` mostra v1 |
| 11 | Proteger Subject/Question; RBAC próprio recurso | 401/403 Bruno |
| 12 | Secrets, PR, README | merge só com ✅ |

## Endpoints Subject (contrato)

Base: `/api/v1/subjects`

| Método | Path | Body | Status |
|--------|------|------|--------|
| GET | `/` | — | 200 `{ success, data, total }` |
| GET | `/:id` | — | 200 / 404 |
| POST | `/` | `{ nome, descricao?, professorId }` | 201 |
| PUT | `/:id` | parcial | 200 / 404 |
| DELETE | `/:id` | — | 200 ou 204 |

Nunca retornar `senhaHash` em includes de User.

## Endpoints Question (contrato)

Base: `/api/v1/questions`

| Método | Path | Body | Status |
|--------|------|------|--------|
| GET | `/` | — | 200 |
| GET | `/:id` | — | 200 / 404 |
| POST | `/` | `{ enunciado, tipo, alternativas?, imagemUrl?, subjectId }` | 201 |
| PUT | `/:id` | parcial | 200 / 404 |
| DELETE | `/:id` | — | 200 ou 204 |

`tipo`: `MULTIPLA_ESCOLHA` | `DISSERTATIVA`.

## Stubs que falham de propósito

Arquivos com `throw new Error('TODO: implemente …')` (ou `NotImplemented`):

- `src/api/v1/services/subjectService.js`
- `src/api/v1/services/questionService.js`

Controllers, routes e schemas de Subject/Question estão **completos** (ligados ao service). O aluno só precisa implementar os dois services acima. Users em `src/api/v1/**/user*` estão completos como referência de padrão.

## Como validar

```bash
npm install
cp .env.example .env   # preencher DATABASE_URL
npx prisma migrate dev
npm test               # oráculo dos exercícios
# Bruno: abrir pasta bruno/ e rodar a coleção
```
