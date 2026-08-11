import bcrypt from 'bcrypt';

/**
 * Objetivo: encapsular hash e verificação de senha com bcrypt.
 * Descrição: utilitário de segurança; usado pelo authService.
 * Aula 11 — substitui o placeholder plaintext das aulas anteriores.
 */
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const hashPassword = async plain => bcrypt.hash(plain, SALT_ROUNDS);

export const verifyPassword = async (plain, hash) => bcrypt.compare(plain, hash);
