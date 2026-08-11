# gerador-provas-api

Template do curso **Back-end 2026** (IFNMG — BSI 6º período).

## Início rápido

1. Use este repositório como **GitHub Template** (ou fork).
2. Abra no Codespaces.
3. `npm install`
4. Copie `.env.example` → `.env` e preencha `DATABASE_URL` (Neon `provas_dev`).
5. `npx prisma migrate dev`
6. `npm run dev`
7. Health: `GET http://localhost:3000/health`

## Exercícios

Veja [CONTRACT.md](./CONTRACT.md). Professor demonstra **Users**; você implementa **Subject** e **Question** até `npm test` e a coleção Bruno ficarem verdes.

## Scripts

| Script | Uso |
|--------|-----|
| `npm run dev` | nodemon |
| `npm run check` | `node --check` (smoke aula 2) |
| `npm run lint` | ESLint |
| `npm test` | Vitest (unit + integration + contract) |
