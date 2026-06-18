import { pool } from './connection';

export async function initializeDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(100)  NOT NULL,
      email       VARCHAR(255)  NOT NULL UNIQUE,
      password    VARCHAR(255)  NOT NULL,
      role        ENUM('user', 'admin') NOT NULL DEFAULT 'user',
      created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migración: agregar columna role si la tabla ya existía sin ella
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user'`);
  } catch (e: any) {
    if (e.code !== 'ER_DUP_FIELDNAME') throw e;
  }
}
