import { z } from 'zod';

/**
 * Objetivo: validar payloads de criação/atualização de User.
 * Descrição: contrato de entrada da camada de apresentação (v1).
 */
export const createUserSchema = z.object({
  nome: z.string().min(3).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  senha: z.string().min(6).max(100),
  papel: z.enum(['PROFESSOR', 'ADMIN']).default('PROFESSOR').optional(),
  foto: z.string().url().optional().nullable().transform(v => v || null),
});

export const updateUserSchema = z
  .object({
    nome: z.string().min(3).max(100).trim().optional(),
    email: z.string().email().toLowerCase().trim().optional(),
    senha: z.string().min(6).max(100).optional(),
    papel: z.enum(['PROFESSOR', 'ADMIN']).optional(),
    foto: z.string().url().optional().nullable().transform(v => v || null),
  })
  .strict()
  .refine(data => Object.values(data).some(v => v !== undefined), {
    message: 'Pelo menos um campo deve ser fornecido',
  });

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID deve ser um número')
    .transform(Number)
    .refine(val => val > 0, 'ID deve ser positivo'),
});
