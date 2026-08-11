import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Objetivo: gerar especificação OpenAPI a partir de anotações @swagger no código.
 * Descrição: configuração da documentação; montada no app.js.
 * Aula 10 — professor documenta v2; aluno documenta v1.
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gerador de Provas',
      version: '1.0.0',
      description:
        'API REST para gerenciamento de usuários, matérias e questões. Suporta v1 (JSON puro) e v2 (breaking changes + upload multipart).',
    },
    servers: [
      { url: '/api/v1', description: 'v1 — estável, JSON puro' },
      { url: '/api/v2', description: 'v2 — primeiroNome/sobrenome, upload multipart' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido em POST /api/v2/auth/login',
        },
      },
    },
  },
  apis: ['./src/api/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
