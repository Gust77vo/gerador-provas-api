import * as userService from '../services/userService.js';

/**
 * Objetivo: traduzir HTTP ↔ userService v2.
 * Descrição: presentation layer v2; encaminha req.file (aula 9).
 */
export const getAll = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await userService.getAllUsersV2({ page, limit });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const data = await userService.getUserByIdV2(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = await userService.createUserV2(req.body, req.file);
    res.status(201).json({
      success: true,
      message: 'Usuário v2 criado com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = await userService.updateUserV2(req.params.id, req.body, req.file);
    res.status(200).json({
      success: true,
      message: 'Usuário v2 atualizado com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const data = await userService.deleteUserV2(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Usuário v2 removido com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};
