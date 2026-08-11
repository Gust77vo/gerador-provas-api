import { z } from 'zod';

/**
 * Objetivo: validar payloads de Question (exercício do aluno).
 * Descrição: schema Zod da v1.
 */
export const createQuestionSchema = z.object({
  enunciado: z.string().min(5).max(2000).trim(),
  tipo: z.enum(['MULTIPLA_ESCOLHA', 'DISSERTATIVA']),
  alternativas: z.any().optional().nullable(),
  imagemUrl: z.string().url().optional().nullable(),
  subjectId: z.number().int().positive(),
});

export const updateQuestionSchema = z
  .object({
    enunciado: z.string().min(5).max(2000).trim().optional(),
    tipo: z.enum(['MULTIPLA_ESCOLHA', 'DISSERTATIVA']).optional(),
    alternativas: z.any().optional().nullable(),
    imagemUrl: z.string().url().optional().nullable(),
    subjectId: z.number().int().positive().optional(),
  })
  .strict()
  .refine(data => Object.values(data).some(v => v !== undefined), {
    message: 'Pelo menos um campo deve ser fornecido',
  });

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine(val => val > 0),
});
