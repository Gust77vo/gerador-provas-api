import 'dotenv/config';
import app from './app.js';

/**
 * Objetivo: iniciar o servidor HTTP em desenvolvimento/produção.
 * Descrição: entrypoint; testes importam app.js diretamente.
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor na porta ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`API v1: http://localhost:${PORT}/api/v1`);
});
