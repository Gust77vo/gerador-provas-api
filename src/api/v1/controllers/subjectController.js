import * as subjectService from '../services/subjectService.js';

/**
 * Objetivo: traduzir HTTP ↔ subjectService.
 * Descrição: presentation layer. EXERCÍCIO — siga o padrão de userController.
 */
export const getAll = async (req, res, next) => {
  try {
    const data = await subjectService.getAllSubjects();
    res.status(200).json({ success: true, data, total: data.length });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const data = await subjectService.getSubjectById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = await subjectService.createSubject(req.body);
    res.status(201).json({
      success: true,
      message: 'Matéria criada com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = await subjectService.updateSubject(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Matéria atualizada com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const data = await subjectService.deleteSubject(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Matéria removida com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};
