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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS routes (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      name             VARCHAR(100) NOT NULL,
      origin_city      VARCHAR(100) NOT NULL,
      destination_city VARCHAR(100) NOT NULL,
      estimated_days   INT          NOT NULL,
      created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS shipments (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      user_id      INT            NOT NULL,
      carrier_id   INT            NULL,
      route_id     INT            NULL,
      weight       DECIMAL(10,2)  NOT NULL,
      width        DECIMAL(10,2)  NOT NULL,
      height       DECIMAL(10,2)  NOT NULL,
      length       DECIMAL(10,2)  NOT NULL,
      product_type ENUM('electronica','ropa','alimentos','documentos','fragil','peligroso') NOT NULL,
      dest_address VARCHAR(255)   NOT NULL,
      dest_city    VARCHAR(100)   NOT NULL,
      dest_country VARCHAR(100)   NOT NULL,
      dest_zip     VARCHAR(20)    NOT NULL,
      status       ENUM('pending','assigned','in_transit','delivered','cancelled') NOT NULL DEFAULT 'pending',
      created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_shipment_user    FOREIGN KEY (user_id)    REFERENCES users(id),
      CONSTRAINT fk_shipment_carrier FOREIGN KEY (carrier_id) REFERENCES carriers(id),
      CONSTRAINT fk_shipment_route   FOREIGN KEY (route_id)   REFERENCES routes(id)
    )
  `);

  // Migración: eliminar columna role de users si existía de versiones anteriores
  try {
    await pool.query(`ALTER TABLE users DROP COLUMN role`);
  } catch (e: any) {
    if (e.code !== 'ER_CANT_DROP_FIELD_OR_KEY') throw e;
  }
}
