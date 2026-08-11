import { z } from 'zod';

/**
 * Objetivo: validar payloads de Subject (exercício do aluno).
 * Descrição: schema Zod da v1; aplicar nas routes com validate().
 *
 * TODO (aula 6): refine regras se necessário; já usável nas aulas 4–5 com validação básica.
 */
export const createSubjectSchema = z.object({
  nome: z.string().min(2).max(120).trim(),
  descricao: z.string().max(500).optional().nullable(),
  professorId: z.number().int().positive(),
});

export const updateSubjectSchema = z
  .object({
    nome: z.string().min(2).max(120).trim().optional(),
    descricao: z.string().max(500).optional().nullable(),
    professorId: z.number().int().positive().optional(),
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
