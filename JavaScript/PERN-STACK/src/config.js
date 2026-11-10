export const PORT = process.env.PORT || 3000;

export const PG_PORT = process.env.PG_PORT || 5432;
export const PG_HOST = process.env.PG_HOST || 'localhost';
export const PG_USER = process.env.PG_USER || 'postgres';
export const PG_PASSWORD = process.env.PG_PASSWORD || 'admin';
export const PG_DATABASE = process.env.PG_DATABASE || 'PERN';

export const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';
export const JWT_SECRET = process.env.JWT_SECRET || (
    process.env.NODE_ENV === 'production' ? undefined : 'xyz123'
);

if (!JWT_SECRET) {
    throw new Error('Falta configurar JWT_SECRET en producción');
}