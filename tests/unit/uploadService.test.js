import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Objetivo: testar uploadService isolado com vi.mock (aula 9).
 * Descrição: unit test; não chama Uploadcare de verdade.
 */
vi.mock('@uploadcare/upload-client', () => ({
  UploadClient: vi.fn().mockImplementation(() => ({
    uploadFile: vi.fn().mockResolvedValue({
      cdnUrl: 'https://ucarecdn.com/fake-uuid/',
    }),
  })),
}));

describe('uploadService (aula 9 — vi.mock)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('exporta uploadFile e deleteFile', async () => {
    const mod = await import('../../src/api/v2/services/uploadService.js');
    expect(typeof mod.uploadFile).toBe('function');
    expect(typeof mod.deleteFile).toBe('function');
  });

  it('lança erro quando UPLOADCARE_PUBLIC_KEY não está configurada', async () => {
    const { uploadFile } = await import(
      '../../src/api/v2/services/uploadService.js'
    );
    // Sem a env var, o service lança ValidationError
    await expect(uploadFile(Buffer.from('x'), 'test.jpg')).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
    });
  });
});
