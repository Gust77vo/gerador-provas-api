import 'dotenv/config';
import app from './app.js';

/**
 * Objetivo: iniciar o servidor HTTP em desenvolvimento/produção.
 * Descrição: entrypoint; testes importam app.js diretamente.
 */
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
  console.log("Health check: http://localhost:" + PORT + "/health");
  // ADICIONADO: endereço da documentação interativa e da V2.
  console.log("Documentação Swagger: http://localhost:" + PORT + "/api-docs");
  console.log("API v1: http://localhost:" + PORT + "/v1");
  console.log("API v2: http://localhost:" + PORT + "/v2");
  console.log("Usuários v1: http://localhost:" + PORT + "/v1/users");
  console.log("Usuários v2: http://localhost:" + PORT + "/v2/users");
});
