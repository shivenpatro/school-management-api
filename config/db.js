// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables from .env file

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the MySQL database.');
    await ensureSchoolsTable();
    connection.release();
  } catch (error) {
    console.error('Error connecting to the MySQL database:', error);
    // Exit process if DB connection fails
    process.exit(1);
  }
}

// Create the schools table if it doesn't exist
async function ensureSchoolsTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

  try {
    await pool.query(createTableSQL);
    console.log('Ensured that the schools table exists.');
  } catch (error) {
    console.error('Error ensuring schools table exists:', error);
    process.exit(1);
  }
}

testConnection();

module.exports = pool; 