import multer from 'multer';

/**
 * Objetivo: fazer parse de requisições multipart/form-data.
 * Descrição: configuração de infra; bufferiza arquivo na memória para envio ao Uploadcare.
 * Aula 9 — usado nas rotas v2 que recebem arquivo.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.'));
    }
  },
});

export default upload;
