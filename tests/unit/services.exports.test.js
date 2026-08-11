import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Objetivo: garantir que o stub de Subject ainda sinaliza NotImplemented
 * até o aluno implementar (oráculo inverso na aula 3–4; depois o aluno troca o teste).
 *
 * A partir da aula 5, o aluno implementa o service e estes testes de "stub"
 * devem ser substituídos pelos de behavior em subjectService.behavior.test.js
 * — aqui usamos o contrato de assinatura.
 */
describe('subjectService — contrato de stub (aula 4–5)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('exporta as cinco operações CRUD', async () => {
    const mod = await import('../../src/api/v1/services/subjectService.js');
    expect(typeof mod.getAllSubjects).toBe('function');
    expect(typeof mod.getSubjectById).toBe('function');
    expect(typeof mod.createSubject).toBe('function');
    expect(typeof mod.updateSubject).toBe('function');
    expect(typeof mod.deleteSubject).toBe('function');
  });
});

describe('questionService — contrato de stub (aula 4–5)', () => {
  it('exporta as cinco operações CRUD', async () => {
    const mod = await import('../../src/api/v1/services/questionService.js');
    expect(typeof mod.getAllQuestions).toBe('function');
    expect(typeof mod.getQuestionById).toBe('function');
    expect(typeof mod.createQuestion).toBe('function');
    expect(typeof mod.updateQuestion).toBe('function');
    expect(typeof mod.deleteQuestion).toBe('function');
  });
});
