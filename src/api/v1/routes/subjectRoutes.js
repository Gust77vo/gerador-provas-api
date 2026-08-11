import express from 'express';
import * as subjectController from '../controllers/subjectController.js';
import validate from '../../../middlewares/validate.js';
import {
  createSubjectSchema,
  updateSubjectSchema,
  idParamSchema,
} from '../schemas/subjectSchema.js';

/**
 * Objetivo: expor CRUD de matérias em /api/v1/subjects.
 * Descrição: rotas do exercício do aluno (já conectadas; implemente o service).
 */
const router = express.Router();

router.get('/', subjectController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), subjectController.getById);
router.post('/', validate(createSubjectSchema, 'body'), subjectController.create);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateSubjectSchema, 'body'),
  subjectController.update,
);
router.delete('/:id', validate(idParamSchema, 'params'), subjectController.remove);

export default router;
