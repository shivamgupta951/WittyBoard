import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://placeholder-url';

// Drizzle uses Neon's HTTP client here, keeping database credentials and query
// execution on the server instead of shipping them to client components.
const sql = neon(databaseUrl);
export const db = drizzle({ client: sql, schema });
export * from '@/db/schema';
