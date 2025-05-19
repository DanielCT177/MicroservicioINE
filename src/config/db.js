const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });  // 👈 importante porque si estás en src/, tienes que subir un nivel

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


connection.connect((error) => {
  if (error) {
    console.error('Error de conexión a la base de datos:', error);
  } else {
    console.log('Conectado a la base de datos MySQL 🚀');
  }
});

module.exports = connection;
