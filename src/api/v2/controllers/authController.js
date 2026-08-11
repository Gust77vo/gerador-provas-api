import * as authService from '../services/authService.js';

/**
 * Objetivo: traduzir HTTP ↔ authService.
 * Descrição: presentation layer de auth; sem regra de negócio.
 */
export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.sub);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
