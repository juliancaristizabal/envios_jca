import { pool } from './connection';

export async function initializeDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(100)  NOT NULL,
      email       VARCHAR(255)  NOT NULL UNIQUE,
      password    VARCHAR(255)  NOT NULL,
      created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(100)  NOT NULL,
      email       VARCHAR(255)  NOT NULL UNIQUE,
      password    VARCHAR(255)  NOT NULL,
      created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS carriers (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      name         VARCHAR(100)                     NOT NULL,
      phone        VARCHAR(20)                      NOT NULL,
      vehicle_type ENUM('moto','van','camion')       NOT NULL,
      capacity_kg  DECIMAL(10,2)                    NOT NULL,
      capacity_m3  DECIMAL(10,2)                    NOT NULL,
      is_available BOOLEAN                          NOT NULL DEFAULT TRUE,
      created_at   TIMESTAMP                        DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migración: eliminar columna role de users si existía de versiones anteriores
  try {
    await pool.query(`ALTER TABLE users DROP COLUMN role`);
  } catch (e: any) {
    if (e.code !== 'ER_CANT_DROP_FIELD_OR_KEY') throw e;
  }
}
