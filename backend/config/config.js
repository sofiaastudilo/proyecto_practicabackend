/* config.js: Este archivo se encarga de configurar y establecer
la conexión entre el backend y la base de datos MySQL.

Su función en el proyecto es permitir que otros archivos,
como los modelos, puedan ejecutar consultas SQL utilizando
una conexión centralizada. */


// Carga las variables de entorno desde el archivo .env
require('dotenv').config();


// Importa la librería mysql
const mysql = require('mysql');


// Crea la conexión con MySQL utilizando variables de entorno
const db = mysql.createConnection({

  // Dirección del servidor MySQL
  host: process.env.DB_HOST,

  // Usuario de MySQL
  user: process.env.DB_USER,

  // Contraseña del usuario MySQL
  password: process.env.DB_PASSWORD,

  // Nombre de la base de datos
  database: process.env.DB_NAME,

  // Puerto de MySQL
  port: process.env.DB_PORT
});


// Intenta conectar el backend con la base de datos
db.connect(function(err) {

  // Si ocurre un error, detiene la ejecución y muestra el error
  if (err) throw err;

  // Mensaje de conexión exitosa
  console.log('Base de datos conectada')
});


// Exporta la conexión para utilizarla en otros archivos
module.exports = db;