import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  password: 'football',
  host: 'localhost',
  port: 5432,
  database: 'umut',
});

export default pool;
