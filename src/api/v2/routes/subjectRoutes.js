import express from 'express';
import * as subjectController from '../controllers/subjectController.js';
import validate from '../../../middlewares/validate.js';
import {
  createSubjectSchemaV2,
  updateSubjectSchemaV2,
  idParamSchema,
} from '../schemas/subjectSchema.js';

/**
 * Objetivo: expor CRUD de matérias em /api/v2/subjects.
 * Descrição: stub conectado — implemente o subjectService v2 (aula 8).
 */
const router = express.Router();

router.get('/', subjectController.getAll);
router.get('/:id', validate(idParamSchema, 'params'), subjectController.getById);
router.post('/', validate(createSubjectSchemaV2, 'body'), subjectController.create);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateSubjectSchemaV2, 'body'),
  subjectController.update,
);
router.delete('/:id', validate(idParamSchema, 'params'), subjectController.remove);

export default router;
