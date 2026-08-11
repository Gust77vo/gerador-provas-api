import { z } from 'zod';

/**
 * Objetivo: validar payloads v2 de User com breaking changes.
 * Descrição: schema Zod v2 — `nome` virou `primeiroNome` + `sobrenome`.
 * Aula 8 — breaking change controlado.
 */
export const createUserSchemaV2 = z.object({
  primeiroNome: z.string().min(2).max(60).trim(),
  sobrenome: z.string().min(2).max(60).trim(),
  telefone: z.string().max(20).optional().nullable(),
  email: z.string().email().toLowerCase().trim(),
  senha: z.string().min(6).max(100),
  papel: z.enum(['PROFESSOR', 'ADMIN']).default('PROFESSOR').optional(),
  foto: z.string().url().optional().nullable().transform(v => v || null),
});

export const updateUserSchemaV2 = z
  .object({
    primeiroNome: z.string().min(2).max(60).trim().optional(),
    sobrenome: z.string().min(2).max(60).trim().optional(),
    telefone: z.string().max(20).optional().nullable(),
    email: z.string().email().toLowerCase().trim().optional(),
    senha: z.string().min(6).max(100).optional(),
    papel: z.enum(['PROFESSOR', 'ADMIN']).optional(),
    foto: z.string().url().optional().nullable().transform(v => v || null),
  })
  .strict()
  // Body pode vir vazio no PUT multipart quando só a foto (arquivo) muda — Multer.
  .refine(data => Object.keys(data).length === 0 || Object.values(data).some(v => v !== undefined), {
    message: 'Pelo menos um campo deve ser fornecido',
  });

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine(val => val > 0),
});
