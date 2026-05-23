/**
 * Reusable schemas and seed data for the in-browser SQL playground.
 *
 * Each fixture exports a single SQL string that creates tables, inserts
 * rows, and can be re-run idempotently (DROP TABLE IF EXISTS first).
 *
 * Lessons embed a playground via a fenced block:
 *
 *   ```sql-playground { fixture: ecommerce, initial: "SELECT * FROM customers" }
 *   ```
 *
 * The renderer looks up the fixture name in this map.
 */

export const ECOMMERCE_FIXTURE = `
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE customers (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  city        TEXT,
  signed_up   DATE
);

CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT,
  price       NUMERIC(10, 2) NOT NULL,
  in_stock    INTEGER DEFAULT 0
);

CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  status      TEXT NOT NULL DEFAULT 'pending',
  total       NUMERIC(10, 2) NOT NULL,
  created_at  DATE NOT NULL
);

CREATE TABLE order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER REFERENCES orders(id),
  product_id  INTEGER REFERENCES products(id),
  quantity    INTEGER NOT NULL,
  unit_price  NUMERIC(10, 2) NOT NULL
);

INSERT INTO customers (name, email, city, signed_up) VALUES
  ('Alice Chen',     'alice@example.com',  'San Francisco', '2024-01-15'),
  ('Bob Martinez',   'bob@example.com',    'Austin',        '2024-02-03'),
  ('Carol Singh',    'carol@example.com',  'Toronto',       '2024-02-18'),
  ('David Kim',      'david@example.com',  'San Francisco', '2024-03-22'),
  ('Eve Patel',      'eve@example.com',    'London',        '2024-04-10'),
  ('Frank Müller',   'frank@example.com',  'Berlin',        '2024-05-01'),
  ('Grace Nakamura', 'grace@example.com',  'Tokyo',         '2024-06-12'),
  ('Henry Brown',    'henry@example.com',  'Austin',        '2024-07-04');

INSERT INTO products (name, category, price, in_stock) VALUES
  ('Wireless Keyboard',  'Electronics', 79.99,  42),
  ('Standing Desk',      'Furniture',   349.00, 8),
  ('USB-C Hub',          'Electronics', 39.50,  120),
  ('Ergonomic Chair',    'Furniture',   459.00, 15),
  ('Mechanical Mouse',   'Electronics', 89.00,  60),
  ('Monitor Arm',        'Accessories', 119.00, 25),
  ('Desk Lamp',          'Accessories', 49.00,  80),
  ('Cable Organizer',    'Accessories', 14.99,  200);

INSERT INTO orders (customer_id, status, total, created_at) VALUES
  (1, 'completed', 168.99, '2024-08-01'),
  (2, 'completed', 459.00, '2024-08-03'),
  (1, 'completed',  39.50, '2024-08-15'),
  (3, 'pending',   349.00, '2024-09-02'),
  (4, 'completed', 128.50, '2024-09-05'),
  (5, 'completed',  64.49, '2024-09-10'),
  (1, 'refunded',  89.00,  '2024-09-12'),
  (6, 'completed', 538.00, '2024-09-18'),
  (2, 'pending',   168.49, '2024-09-22'),
  (4, 'completed', 178.99, '2024-09-25'),
  (7, 'completed',  49.00, '2024-09-28'),
  (3, 'completed', 233.99, '2024-10-01');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 79.99),  (1, 3, 1, 39.50),  (1, 7, 1, 49.00),
  (2, 4, 1, 459.00),
  (3, 3, 1, 39.50),
  (4, 2, 1, 349.00),
  (5, 5, 1, 89.00),  (5, 7, 1, 49.00),
  (6, 7, 1, 49.00),  (6, 8, 1, 14.99),
  (7, 5, 1, 89.00),
  (8, 2, 1, 349.00), (8, 6, 1, 119.00), (8, 7, 1, 49.00), (8, 8, 1, 14.99),
  (9, 1, 1, 79.99),  (9, 3, 1, 39.50),  (9, 7, 1, 49.00),
  (10, 5, 2, 89.50),
  (11, 7, 1, 49.00),
  (12, 6, 1, 119.00), (12, 8, 1, 14.99), (12, 7, 2, 49.00);
`;

export const EMPLOYEES_FIXTURE = `
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

CREATE TABLE departments (
  id     SERIAL PRIMARY KEY,
  name   TEXT NOT NULL,
  budget NUMERIC(12, 2)
);

CREATE TABLE employees (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  dept_id      INTEGER REFERENCES departments(id),
  manager_id   INTEGER REFERENCES employees(id),
  salary       NUMERIC(10, 2),
  hired        DATE
);

INSERT INTO departments (name, budget) VALUES
  ('Engineering', 2500000.00),
  ('Sales',       1200000.00),
  ('Marketing',    800000.00),
  ('Support',      600000.00);

INSERT INTO employees (name, email, dept_id, manager_id, salary, hired) VALUES
  ('Alice CEO',       'alice@co.com',   NULL, NULL, 250000, '2020-01-01'),
  ('Bob VP Eng',      'bob@co.com',     1,    1,    220000, '2020-02-15'),
  ('Carol VP Sales',  'carol@co.com',   2,    1,    210000, '2020-03-10'),
  ('David Eng Lead',  'david@co.com',   1,    2,    180000, '2020-06-01'),
  ('Eve Eng',         'eve@co.com',     1,    4,    140000, '2021-01-15'),
  ('Frank Eng',       'frank@co.com',   1,    4,    135000, '2021-02-01'),
  ('Grace Eng',       'grace@co.com',   1,    4,    145000, '2022-09-12'),
  ('Henry Sales',     'henry@co.com',   2,    3,    120000, '2021-03-22'),
  ('Iris Sales',      'iris@co.com',    2,    3,    110000, '2022-05-10'),
  ('Jack Marketing',  'jack@co.com',    3,    1,    115000, '2021-08-04');
`;

export const FIXTURES: Record<string, { label: string; sql: string; tables: string[] }> = {
  ecommerce: {
    label: "E-commerce (customers, orders, products)",
    sql: ECOMMERCE_FIXTURE,
    tables: ["customers", "products", "orders", "order_items"],
  },
  employees: {
    label: "HR (employees, departments — for self-joins)",
    sql: EMPLOYEES_FIXTURE,
    tables: ["departments", "employees"],
  },
};

export type FixtureKey = keyof typeof FIXTURES;
