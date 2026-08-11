import { NotImplementedError } from '../../../errors/AppError.js';

/**
 * Objetivo: concentrar regras de negócio de questões (Question).
 * Descrição: business layer; espelhe userService / subjectService. EXERCÍCIO DO ALUNO.
 */
export const getAllQuestions = async () => {
  throw new NotImplementedError('TODO: implemente getAllQuestions');
};

export const getQuestionById = async _id => {
  throw new NotImplementedError('TODO: implemente getQuestionById');
};

export const createQuestion = async _data => {
  throw new NotImplementedError('TODO: implemente createQuestion');
};

export const updateQuestion = async (_id, _data) => {
  throw new NotImplementedError('TODO: implemente updateQuestion');
};

export const deleteQuestion = async _id => {
  throw new NotImplementedError('TODO: implemente deleteQuestion');
};

export default {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
