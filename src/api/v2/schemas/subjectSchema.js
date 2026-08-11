import { z } from 'zod';

/**
 * Objetivo: validar payloads de Subject na v2.
 * Descrição: schema Zod v2 — stub para o aluno espelhar Users v2 (paginação).
 * Aula 8 — exercício opcional de versionamento em Subject.
 */
export const createSubjectSchemaV2 = z.object({
  nome: z.string().min(2).max(120).trim(),
  descricao: z.string().max(500).optional().nullable(),
  professorId: z.coerce.number().int().positive(),
});

export const updateSubjectSchemaV2 = z
  .object({
    nome: z.string().min(2).max(120).trim().optional(),
    descricao: z.string().max(500).optional().nullable(),
    professorId: z.coerce.number().int().positive().optional(),
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
