import * as subjectService from '../services/subjectService.js';

/**
 * Objetivo: traduzir HTTP ↔ subjectService v2.
 * Descrição: presentation layer v2. EXERCÍCIO — espelhe userController v2.
 */
export const getAll = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await subjectService.getAllSubjectsV2({ page, limit });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const data = await subjectService.getSubjectByIdV2(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = await subjectService.createSubjectV2(req.body);
    res.status(201).json({
      success: true,
      message: 'Matéria v2 criada com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = await subjectService.updateSubjectV2(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Matéria v2 atualizada com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const data = await subjectService.deleteSubjectV2(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Matéria v2 removida com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};
