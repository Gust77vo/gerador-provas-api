import { NotImplementedError } from '../../../errors/AppError.js';

/**
 * Objetivo: concentrar regras de negócio de matérias (Subject).
 * Descrição: business layer; espelhe userService.js. EXERCÍCIO DO ALUNO.
 *
 * Dica (aula 5): use prisma.subject; select sem dados sensíveis do professor além do necessário.
 */
export const getAllSubjects = async () => {
  throw new NotImplementedError('TODO: implemente getAllSubjects (veja getAllUsers)');
};

export const getSubjectById = async _id => {
  throw new NotImplementedError('TODO: implemente getSubjectById');
};

export const createSubject = async _data => {
  throw new NotImplementedError('TODO: implemente createSubject');
};

export const updateSubject = async (_id, _data) => {
  throw new NotImplementedError('TODO: implemente updateSubject');
};

export const deleteSubject = async _id => {
  throw new NotImplementedError('TODO: implemente deleteSubject');
};

export default {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
