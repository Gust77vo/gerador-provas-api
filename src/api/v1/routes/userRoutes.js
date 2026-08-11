import express from 'express';
import * as userController from '../controllers/userController.js';
import validate from '../../../middlewares/validate.js';
import {
  createUserSchema,
  updateUserSchema,
  idParamSchema,
} from '../schemas/userSchema.js';

/**
 * Objetivo: mapear verbos HTTP de /users para o controller.
 * Descrição: camada de rotas v1 (referência). Aula 10 — base de @swagger para o desafio.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required: [nome, email, senha]
 *       properties:
 *         nome: { type: string, example: "Prof. Ana" }
 *         email: { type: string, format: email }
 *         senha: { type: string, format: password, minLength: 6 }
 *         papel: { type: string, enum: [PROFESSOR, ADMIN] }
 *         foto: { type: string, format: uri, nullable: true }
 *     UserResponse:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         nome: { type: string }
 *         email: { type: string }
 *         papel: { type: string }
 *         foto: { type: string, nullable: true }
 *         createdAt: { type: string, format: date-time }
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: false }
 *         error:
 *           type: object
 *           properties:
 *             code: { type: string }
 *             message: { type: string }
 */
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista usuários (v1)
 *     tags: [Usuários v1]
 *     responses:
 *       200:
 *         description: Lista retornada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/UserResponse' }
 *                 total: { type: integer }
 */
router.get('/', userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca usuário por ID (v1)
 *     tags: [Usuários v1]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuário encontrado }
 *       404:
 *         description: Não encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get('/:id', validate(idParamSchema, 'params'), userController.getById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria usuário (v1) — JSON puro
 *     tags: [Usuários v1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/User' }
 *     responses:
 *       201: { description: Criado }
 *       400: { description: Validação }
 *       409: { description: Email em uso }
 */
router.post('/', validate(createUserSchema, 'body'), userController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza usuário (v1)
 *     tags: [Usuários v1]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/User' }
 *     responses:
 *       200: { description: Atualizado }
 */
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateUserSchema, 'body'),
  userController.update,
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove usuário (v1)
 *     tags: [Usuários v1]
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
