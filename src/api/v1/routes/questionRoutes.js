import express from 'express';
import * as questionController from '../controllers/questionController.js';
import validate from '../../../middlewares/validate.js';
import {
  createQuestionSchema,
  updateQuestionSchema,
  idParamSchema,
} from '../schemas/questionSchema.js';

/**
 * Objetivo: expor CRUD de questões em /api/v1/questions.
 * Descrição: rotas do exercício do aluno.
 */
const router = express.Router();

router.get('/', questionController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), questionController.getById);
router.post('/', validate(createQuestionSchema, 'body'), questionController.create);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateQuestionSchema, 'body'),
  questionController.update,
);
router.delete('/:id', validate(idParamSchema, 'params'), questionController.remove);

export default router;
