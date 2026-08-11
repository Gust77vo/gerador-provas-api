import express from 'express';
import * as userController from '../controllers/userController.js';
import validate from '../../../middlewares/validate.js';
import upload from '../../../config/multer.js';
import {
  createUserSchemaV2,
  updateUserSchemaV2,
  idParamSchema,
} from '../schemas/userSchema.js';

/**
 * Objetivo: mapear verbos HTTP de /api/v2/users para o controller v2.
 * Descrição: rotas v2 — Multer antes do validate (aula 9); Swagger demo (aula 10).
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserV2:
 *       type: object
 *       required: [primeiroNome, sobrenome, email, senha]
 *       properties:
 *         primeiroNome: { type: string, example: "Maria" }
 *         sobrenome: { type: string, example: "Silva" }
 *         telefone: { type: string, nullable: true }
 *         email: { type: string, format: email }
 *         senha: { type: string, format: password, minLength: 6 }
 *         papel: { type: string, enum: [PROFESSOR, ADMIN] }
 *         foto:
 *           type: string
 *           format: binary
 *           description: Foto de perfil (multipart)
 *     UserV2Response:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         primeiroNome: { type: string }
 *         sobrenome: { type: string }
 *         email: { type: string }
 *         telefone: { type: string, nullable: true }
 *         papel: { type: string }
 *         foto: { type: string, nullable: true }
 */
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista usuários paginados (v2)
 *     tags: [Usuários v2]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Lista paginada }
 */
router.get('/', userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca usuário por ID (v2)
 *     tags: [Usuários v2]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuário encontrado }
 *       404: { description: Não encontrado }
 */
router.get('/:id', validate(idParamSchema, 'params'), userController.getById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria usuário com foto opcional (v2)
 *     tags: [Usuários v2]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema: { $ref: '#/components/schemas/UserV2' }
 *         application/json:
 *           schema:
 *             type: object
 *             required: [primeiroNome, sobrenome, email, senha]
 *             properties:
 *               primeiroNome: { type: string }
 *               sobrenome: { type: string }
 *               email: { type: string }
 *               senha: { type: string }
 *     responses:
 *       201: { description: Criado }
 *       400: { description: Validação }
 *       409: { description: Email em uso }
 */
router.post(
  '/',
  upload.single('foto'),
  validate(createUserSchemaV2, 'body'),
  userController.create,
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza usuário (v2) — troca foto com limpeza no CDN
 *     tags: [Usuários v2]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema: { $ref: '#/components/schemas/UserV2' }
 *     responses:
 *       200: { description: Atualizado }
 */
router.put(
  '/:id',
  upload.single('foto'),
  validate(idParamSchema, 'params'),
  validate(updateUserSchemaV2, 'body'),
  userController.update,
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove usuário e foto do CDN (v2)
 *     tags: [Usuários v2]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Removido }
 */
router.delete('/:id', validate(idParamSchema, 'params'), userController.remove);

export default router;
