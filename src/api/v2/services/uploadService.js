import { UploadClient } from '@uploadcare/upload-client';
import { ValidationError } from '../../../errors/AppError.js';

/**
 * Objetivo: isolar integração com Uploadcare.
 * Descrição: camada de infraestrutura chamada pelo userService v2 e questionService.
 * Aula 9 — POST (upload), PUT (troca com limpeza), DELETE (remoção do CDN).
 */

let client;

const getClient = () => {
  if (!client) {
    if (!process.env.UPLOADCARE_PUBLIC_KEY) {
      throw new ValidationError('UPLOADCARE_PUBLIC_KEY não configurada');
    }
    client = new UploadClient({ publicKey: process.env.UPLOADCARE_PUBLIC_KEY });
  }
  return client;
};

/**
 * Objetivo: enviar arquivo para o Uploadcare e retornar a URL CDN.
 * @param {Buffer} buffer - Conteúdo do arquivo
 * @param {string} originalName - Nome original do arquivo
 * @returns {Promise<string>} URL CDN do arquivo enviado
 */
export const uploadFile = async (buffer, originalName) => {
  const uc = getClient();
  const blob = new Blob([buffer]);

  const result = await uc.uploadFile(blob, {
    fileName: originalName || 'upload',
    contentType: 'image/jpeg',
    store: '1',
  });

  return result.cdnUrl;
};

/**
 * Objetivo: remover arquivo do Uploadcare pela URL CDN.
 * @param {string} cdnUrl - URL CDN retornada pelo Uploadcare
 * Descrição: extrai o UUID da URL e chama a API de deleção.
 * Aula 9 — chamado no PUT (antes de upload novo) e no DELETE.
 */
export const deleteFile = async cdnUrl => {
  if (!cdnUrl) return;

  if (!process.env.UPLOADCARE_SECRET_KEY) {
    console.warn('UPLOADCARE_SECRET_KEY não configurada — arquivo não removido do CDN');
    return;
  }

  // Extrai UUID da URL: https://ucarecdn.com/{UUID}/filename.jpg
  const match = cdnUrl.match(/ucarecdn\.com\/([a-f0-9-]{36})/i);
  if (!match) return;

  const uuid = match[1];

  await fetch(`https://api.uploadcare.com/files/${uuid}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Uploadcare.Simple ${process.env.UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
    },
  });
};

export default { uploadFile, deleteFile };
