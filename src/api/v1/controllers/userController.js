import * as userService from '../services/userService.js';

/**
 * Objetivo: traduzir HTTP ↔ service de usuários.
 * Descrição: presentation layer; sem regra de negócio.
 */
export const getAll = async (req, res, next) => {
  try {
    const data = await userService.getAllUsers();
    res.status(200).json({ success: true, data, total: data.length });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const data = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const data = await userService.deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Usuário removido com sucesso',
      data,
    });
  } catch (error) {
    next(error);
  }
};
