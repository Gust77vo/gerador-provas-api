import { NotImplementedError } from '../../../errors/AppError.js';

/**
 * Objetivo: concentrar regras de negócio de matérias na v2.
 * Descrição: stub — exercício: espelhe getAllUsersV2 (paginação) e o CRUD da v1.
 * Aula 8.
 */
export const getAllSubjectsV2 = async (_opts = {}) => {
  throw new NotImplementedError('TODO: implemente getAllSubjectsV2 com paginação');
};

export const getSubjectByIdV2 = async _id => {
  throw new NotImplementedError('TODO: implemente getSubjectByIdV2');
};

export const createSubjectV2 = async _data => {
  throw new NotImplementedError('TODO: implemente createSubjectV2');
};

export const updateSubjectV2 = async (_id, _data) => {
  throw new NotImplementedError('TODO: implemente updateSubjectV2');
};

export const deleteSubjectV2 = async _id => {
  throw new NotImplementedError('TODO: implemente deleteSubjectV2');
};

export default {
  getAllSubjectsV2,
  getSubjectByIdV2,
  createSubjectV2,
  updateSubjectV2,
  deleteSubjectV2,
};
