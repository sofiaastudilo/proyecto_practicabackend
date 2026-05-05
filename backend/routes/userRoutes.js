 /* userRoutes.js: Define las rutas (es decir, los endpoints) del módulo de usuarios.
Conecta cada petición HTTP (GET, POST, PUT, DELETE) con su función correspondiente
en el controlador, aplica middlewares de autenticación y autorización
para proteger ciertas rutas según el rol del usuario. */
 
// Importamos Express para usar el sistema de rutas
 const express = require('express');


// Creamos un enrutador para definir las rutas del módulo usuarios
 const router = express.Router();

 // Importamos el controlador de usuarios (que sería donde está la lógica)
 const userController = require('../controllers/userController');

 // Importamos middlewares para validar los token y roles
 const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
 

 // Rutas públicas
// Ruta para registrar un nuevo usuario (no requiere autenticación)
 router.post('/create', userController.register);

 // Ruta para iniciar sesión (devuelve token JWT)
 router.post('/login', userController.login);
 

 // Rutas protegidas
 // Obtener todos los usuarios (solo admin o seller)
 router.get('/', verifyToken, authorizeRoles(['admin', 'seller']), userController.getAllUsers);

 // Obtener un usuario por ID (solo admin o seller)
 router.get('/:id', verifyToken, authorizeRoles(['admin', 'seller']), userController.getUserById);

 // Actualizar un usuario por ID (solo admin o seller)
 router.put('/:id', verifyToken, authorizeRoles(['admin', 'seller']), userController.getUserUpdate);

 // Eliminar un usuario (solo admin)
 router.delete('/delete/:id', verifyToken, authorizeRoles(['admin']), userController.getUserDelete);
 

// Exportamos el router para que server.js pueda usar estas rutas 
 module.exports = router;