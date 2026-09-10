import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('La variable de entorno DATABASE_URL no está definida.');
}

export const db = neon(process.env.DATABASE_URL);