import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

/**
 * Objetivo: garantir uma única conexão Prisma no processo.
 * Descrição: infraestrutura de dados usada por todos os services.
 */
const prisma = new PrismaClient();

export default prisma;
