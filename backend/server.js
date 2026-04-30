/*server.js: Este archivo configura la aplicación Express del backend. 
Define los middlewares globales, las rutas principales del sistema y el manejo de errores. 
No levanta el servidor directamente, sino que exporta la app para que index.js la ejecute.*/


// Importamos Express para crear la aplicación backend
const express = require('express');

// Importamos Morgan para mostrar logs de las peticiones en consola
const logger = require('morgan');

// Importamos CORS para permitir conexiones desde otros orígenes (frontend, Postman, etc.)
const cors = require('cors');

// Importamos las rutas del módulo de usuarios
const usersRoutes = require('./routes/userRoutes');


// Creamos la aplicación de Express
 const app = express();

 // Middlewares globales (hacen que el backend haga las cosas cuando recibe datos)
 // Middleware para mostrar en consola las peticiones HTTP (GET, POST, etc.)
 app.use(logger('dev'));

 // Middleware para que el servidor entienda datos en formato JSON
 app.use(express.json());

 // Middleware para procesar datos enviados desde formularios
 app.use(express.urlencoded({ extended: true }));

 // Middleware para permitir solicitudes desde otros dominios (evita errores de CORS)
 app.use(cors());


 // Rutas
 // Definimos la ruta base '/api/users' y la conectamos con las rutas del archivo userRoutes
 app.use('/api/users', usersRoutes);


 // Endpoints de prueba
// Endpoint raíz para verificar que el servidor está funcionando
 app.get('/', (req, res) => {
   res.send('Ruta raíz del Backend');
 });

 // Endpoint de prueba adicional
 app.get('/test', (req, res) => {
   res.send('Ruta TEST');
 });

 // Manejo de errores
 // Middleware para capturar y manejar errores en toda la aplicación
 app.use((err, req, res, next) => {

  //para mostrar el error en consola
   console.log(err);

  // Enviamos una respuesta al cliente con el código de error (por defecto 500 si no existe)
  // y mostramos el detalle del error
   res.status(err.status || 500).send(err.stack);
 });

 // Exportamos la app para que index.js pueda usarla y levantar el servidor
 module.exports = app;