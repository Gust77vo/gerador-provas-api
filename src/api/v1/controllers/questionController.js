import * as questionService from '../services/questionService.js';

/**
 * Objetivo: traduzir HTTP ↔ questionService.
 * Descrição: presentation layer. EXERCÍCIO — siga subjectController / userController.
 */
export const getAll = async (req, res, next) => {
  try {
    const data = await questionService.getAllQuestions();
    res.status(200).json({ success: true, data, total: data.length });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const data = await questionService.getQuestionById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = await questionService.createQuestion(req.body);
    res.status(201).json({
      success: true,
      message: 'Questão criada com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = await questionService.updateQuestion(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Questão atualizada com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const data = await questionService.deleteQuestion(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Questão removida com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};
