/* userController.js: Este archivo contiene la lógica de negocio del módulo de usuarios.
Se encarga de recibir las peticiones HTTP desde las rutas, procesarlas (validar datos,
consultar la base de datos, encriptar contraseñas, generar tokens, etc.) y devolver
una respuesta al cliente.

Actúa como intermediario entre las rutas (userRoutes.js) y el modelo (user.js). */

// Importa el modelo User para interactuar con la base de datos
const User = require("../models/user");

// Librería para encriptar y comparar contraseñas
const bcrypt = require("bcryptjs");

// Librería para generar tokens JWT
const jwt = require("jsonwebtoken");

// Importa la clave secreta utilizada para firmar el token
const keys = require("../config/keys");

// Se exportan todas las funciones del controlador
module.exports = {

  // Función para iniciar sesión
  login(req, res) {

    // Obtiene email y contraseña enviados desde Postman o frontend
    const email = req.body.email;
    const password = req.body.password;

    // Busca el usuario por email en la base de datos
    User.findByEmail(email, async (err, myUser) => {

      // Si ocurre un error al consultar
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Error al consultar el usuario",
          error: err,
        });
      }

      // Si el usuario no existe
      if (!myUser) {
        return res.status(401).json({
          success: false,
          message: "El email no existe en la base de datos",
        });
      }

      // Compara la contraseña ingresada con la contraseña encriptada
      const isPasswordValid = await bcrypt.compare(password, myUser.password);

      // Si la contraseña es correcta
      if (isPasswordValid) {

        // Genera un token JWT con información del usuario
        const token = jwt.sign(
          { id: myUser.id, email: myUser.email, role: myUser.role },
          keys.secretOrKey,
          { expiresIn: "1h" }
        );

        // Se crea el objeto de respuesta
        const data = {
          id: myUser.id,
          email: myUser.email,
          name: myUser.name,
          lastname: myUser.lastname,
          image: myUser.image,
          phone: myUser.phone,
          role: myUser.role,

          // Se agrega el token para autenticar futuras peticiones
          session_token: `JWT ${token}`,
        };

        // Retorna respuesta exitosa
        return res.status(201).json({
          success: true,
          message: "Usuario autenticado",
          data: data,
        });

      } else {

        // Si la contraseña es incorrecta
        return res.status(401).json({
          success: false,
          message: "Contraseña o correo incorrecto",
        });
      }
    });
  },

  // Obtiene todos los usuarios registrados
  getAllUsers(req, res) {

    // Llama al modelo para consultar todos los usuarios
    User.findAll((err, users) => {

      // Manejo de error
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Error al listar usuarios",
          error: err,
        });
      }

      // Respuesta exitosa con la lista de usuarios
      return res.status(200).json({
        success: true,
        message: "Lista de usuarios",
        data: users,
      });
    });
  },

  // Obtiene un usuario específico por ID
  getUserById(req, res) {

    // Obtiene el ID desde la URL
    const id = req.params.id;

    // Busca el usuario en la base de datos
    User.findById(id, (err, user) => {

      // Error en la consulta
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Error al consultar el usuario",
          error: err,
        });
      }

      // Si el usuario no existe
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      // Respuesta exitosa
      return res.status(200).json({
        success: true,
        message: "Usuario encontrado",
        data: user,
      });
    });
  },

  // Registra un nuevo usuario
  register(req, res) {

    // Obtiene la información enviada en el body
    const user = req.body;

    // Si no se envía rol, se asigna "user" por defecto
    if (!user.role) {
      user.role = "user";
    }

    // Envía los datos al modelo para crear el usuario
    User.create(user, (err, data) => {

      // Error al crear usuario
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Error al crear al usuario",
          error: err,
        });

      } else {

        // Usuario creado correctamente
        return res.status(201).json({
          success: true,
          message: "Usuario creado correctamente",
          data: data,
        });
      }
    });
  },

  // Actualiza la información de un usuario
  getUserUpdate(req, res) {

    // Obtiene los datos actualizados desde el body
    const user = req.body;

    // Envía los datos al modelo para actualizar
    User.update(user, (err, data) => {

      // Error al actualizar
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Error al actualizar el usuario",
          error: err,
        });
      }

      // Actualización exitosa
      return res.status(200).json({
        success: true,
        message: "Usuario actualizado",
        data: data,
      });
    });
  },

  // Elimina un usuario por ID
  getUserDelete(req, res) {

    // Obtiene el ID desde la URL
    const id = req.params.id;

    // Envía el ID al modelo para eliminar el usuario
    User.delete(id, (err, data) => {

      // Error al eliminar
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Error al eliminar el usuario",
          error: err,
        });
      }

      // Eliminación exitosa
      return res.status(200).json({
        success: true,
        message: "Usuario eliminado",
        data: data,
      });
    });
  },
};