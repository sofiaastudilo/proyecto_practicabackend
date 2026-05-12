/* keys.js: Este archivo almacena configuraciones sensibles relacionadas
con la autenticación JWT.

Su función en el proyecto es proporcionar la clave secreta utilizada
para firmar y verificar tokens de autenticación. */


// Carga las variables de entorno desde el archivo .env
require('dotenv').config();


// Exporta un objeto con la clave secreta JWT
module.exports = {

  // Clave secreta utilizada para generar y validar tokens
  secretOrKey: process.env.JWT_SECRET
};