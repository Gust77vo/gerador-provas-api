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
 *   parameters:
 *     UserId:
 *       in: path
 *       name: id
 *       required: true
 *       schema: { type: integer, minimum: 1 }
 *   responses:
 *     BadRequest:
 *       description: ID ou dados inválidos
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ErrorResponse' }
 *     NotFound:
 *       description: Usuário não encontrado
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ErrorResponse' }
 *     Conflict:
 *       description: Conflito com dados ou vínculos existentes
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   schemas:
 *     UserV1:
 *       type: object
 *       required: [id, nome, email, papel, foto, createdAt, updatedAt]
 *       properties:
 *         id: { type: integer }
 *         nome: { type: string }
 *         email: { type: string, format: email }
 *         papel: { type: string, enum: [PROFESSOR, ADMIN] }
 *         foto: { type: string, format: uri, nullable: true }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *     UserItemEnvelope:
 *       type: object
 *       required: [success, data]
 *       properties:
 *         success: { type: boolean, example: true }
 *         data: { $ref: '#/components/schemas/UserV1' }
 *     UserListEnvelope:
 *       type: object
 *       required: [success, data, total]
 *       properties:
 *         success: { type: boolean, example: true }
 *         data:
 *           type: array
 *           items: { $ref: '#/components/schemas/UserV1' }
 *         total: { type: integer }
 *     UserMutationEnvelope:
 *       type: object
 *       required: [success, message, data]
 *       properties:
 *         success: { type: boolean, example: true }
 *         message: { type: string }
 *         data: { $ref: '#/components/schemas/UserV1' }
 *     UserDeleteEnvelope:
 *       type: object
 *       required: [success, message, data]
 *       properties:
 *         success: { type: boolean, example: true }
 *         message: { type: string }
 *         data:
 *           type: object
 *           required: [id, nome, email]
 *           properties:
 *             id: { type: integer }
 *             nome: { type: string }
 *             email: { type: string, format: email }
 *     CreateUserV1:
 *       type: object
 *       required: [nome, email, senha]
 *       properties:
 *         nome: { type: string, minLength: 3, maxLength: 100 }
 *         email: { type: string, format: email }
 *         senha: { type: string, format: password, minLength: 6, maxLength: 100 }
 *         papel:
 *           type: string
 *           enum: [PROFESSOR, ADMIN]
 *           default: PROFESSOR
 *         foto: { type: string, format: uri, nullable: true }
 *     UpdateUserV1:
 *       type: object
 *       minProperties: 1
 *       additionalProperties: false
 *       properties:
 *         nome: { type: string, minLength: 3, maxLength: 100 }
 *         email: { type: string, format: email }
 *         senha: { type: string, format: password, minLength: 6, maxLength: 100 }
 *         papel: { type: string, enum: [PROFESSOR, ADMIN] }
 *         foto: { type: string, format: uri, nullable: true }
 *     ErrorResponse:
 *       type: object
 *       required: [success, error, timestamp, path]
 *       properties:
 *         success: { type: boolean, example: false }
 *         error:
 *           type: object
 *           required: [code, message]
 *           properties:
 *             code: { type: string }
 *             message: { type: string }
 *             details:
 *               type: array
 *               items: { type: object, additionalProperties: true }
 *         timestamp: { type: string, format: date-time }
 *         path: { type: string }
 */
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista usuários (V1)
 *     tags: [Usuários V1]
 *     responses:
 *       200:
 *         description: Lista retornada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListEnvelope' }
 */
router.get('/', userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca usuário por ID (V1)
 *     tags: [Usuários V1]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserItemEnvelope' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', validate(idParamSchema, 'params'), userController.getById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria usuário (V1) — JSON
 *     tags: [Usuários V1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateUserV1' }
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserMutationEnvelope' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.post('/', validate(createUserSchema, 'body'), userController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza usuário (V1)
 *     tags: [Usuários V1]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateUserV1' }
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserMutationEnvelope' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
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
 *     summary: Remove usuário (V1)
 *     tags: [Usuários V1]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Usuário removido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserDeleteEnvelope' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.delete('/:id', validate(idParamSchema, 'params'), userController.remove);

export default router;
