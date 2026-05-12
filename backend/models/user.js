/* user.js: Este archivo corresponde al modelo de usuarios.
Se encarga de realizar todas las consultas SQL relacionadas con la tabla users
de la base de datos, como crear, consultar, actualizar y eliminar usuarios.

Actúa como intermediario entre el controlador (userController.js)
y MySQL. */

// Importa la conexión a la base de datos
const db = require('../config/config');

// Librería para encriptar contraseñas
const bcrypt = require('bcryptjs');

// Objeto donde se almacenan las funciones del modelo
const User = {};


// ==========================================
// LISTAR TODOS LOS USUARIOS
// ==========================================

// Función para obtener todos los usuarios
User.findAll = (result) => {

  // Consulta SQL para listar usuarios
  const sql = `SELECT id, email, name, lastname, phone, image, role, created_at, updated_at FROM users`;

  // Ejecuta la consulta en MySQL
  db.query(sql, (err, users) => {

    // Si ocurre un error
    if (err) {
      console.log('Error al listar usuarios: ', err);

      // Retorna error
      result(err, null);

    } else {

      // Muestra cuántos usuarios encontró
      console.log('Usuarios encontrados: ', users.length);

      // Retorna los usuarios encontrados
      result(null, users);
    }
  });
};


// ==========================================
// BUSCAR USUARIO POR ID
// ==========================================

// Función para buscar un usuario por ID
User.findById = (id, result) => {

  // Consulta SQL con parámetro dinámico
  const sql = `SELECT id, email, name, lastname, image, phone, role, password FROM users WHERE id = ?`;

  // Ejecuta la consulta enviando el ID
  db.query(sql, [id], (err, user) => {

    // Si ocurre un error
    if (err) {

      console.log('Error al consultar: ', err);

      result(err, null);

    } else {

      // Muestra el usuario encontrado
      console.log('Usuario consultado: ',  user[0] );

      // Retorna el primer resultado encontrado
      result(null, user[0]);
    }
  });
};


// ==========================================
// BUSCAR USUARIO POR EMAIL
// ==========================================

// Función para buscar usuario por email
User.findByEmail = (email, result) => {

  // Consulta SQL filtrando por email
  const sql = `SELECT id, email, name, lastname, image, phone, role, password FROM users WHERE email = ?`;

  // Ejecuta la consulta
  db.query(sql, [email], (err, user) => {

    // Si ocurre error
    if (err) {

      console.log('Error al consultar: ', err);

      result(err, null);

    } else {

      // Muestra usuario encontrado
      console.log('Usuario consultado: ',  user[0] );

      // Retorna usuario encontrado
      result(null, user[0]);
    }
  });
};


// ==========================================
// CREAR USUARIO
// ==========================================

// Función asíncrona para crear usuario
User.create = async (user, result) => {

  // Encripta la contraseña antes de guardarla
  const hash = await bcrypt.hash(user.password, 10);

  // Lista de roles permitidos
  const validRoles = ['admin', 'seller', 'customer', 'user'];

  // Verifica si el rol es válido
  const role = validRoles.includes(user.role) ? user.role : 'user';

  // Consulta SQL para insertar usuario
  const sql = `INSERT INTO users(
                name, 
                lastname,
                email, 
                password,
                phone,
                image,
                role,
                created_at,
                updated_at
            ) VALUES (?,?,?,?,?,?,?,?,?)`;

  // Ejecuta la consulta
  db.query(sql,
    [
      user.name,
      user.lastname,
      user.email,
      hash,
      user.phone,
      user.image,
      role,

      // Fecha de creación
      new Date(),

      // Fecha de actualización
      new Date()

    ], (err, res) => {

      // Si ocurre error
      if (err) {

        console.log('Error al crear al Usuario: ', err);

        result(err, null);

      } else {

        // Muestra usuario creado
        console.log('Usuario creado: ', {id: res.insertId, ...user});

        // Retorna usuario creado
        result(null, {id: res.insertId, ...user});
      }
    }
  );
};


// ==========================================
// ACTUALIZAR USUARIO
// ==========================================

// Función para actualizar usuario
User.update = async (user, result) => {

  // Arreglo para almacenar campos a actualizar
  let fields = [];

  // Arreglo para almacenar valores
  let values = [];

  // Si viene contraseña nueva
  if (user.password) {

    // Encripta nueva contraseña
    const hash = await bcrypt.hash(user.password, 10);

    fields.push("password = ?");
    values.push(hash);
  }

  // Verifica y agrega email
  if (user.email) {
    fields.push("email = ?");
    values.push(user.email);
  }

  // Verifica y agrega nombre
  if (user.name) {
    fields.push("name = ?");
    values.push(user.name);
  }

  // Verifica y agrega apellido
  if (user.lastname) {
    fields.push("lastname = ?");
    values.push(user.lastname);
  }

  // Verifica y agrega teléfono
  if (user.phone) {
    fields.push("phone = ?");
    values.push(user.phone);
  }

  // Verifica y agrega imagen
  if (user.image) {
    fields.push("image = ?");
    values.push(user.image);
  }

  // Verifica y agrega rol
  if (user.role) {
    fields.push("role = ?");
    values.push(user.role);
  }

  // Actualiza fecha de modificación
  fields.push("updated_at = ?");
  values.push(new Date());

  // Consulta SQL dinámica
  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

  // Agrega el ID al final
  values.push(user.id);

  // Ejecuta consulta
  db.query(sql, values, (err, res) => {

    // Si ocurre error
    if (err) {

      console.log('Error al actualizar usuario: ', err);

      result(err, null);

    } else {

      // Muestra usuario actualizado
      console.log('Usuario actualizado: ', { id: user.id, ...user });

      // Retorna datos actualizados
      result(null, { id: user.id, ...user });
    }
  });
};


// ==========================================
// ELIMINAR USUARIO
// ==========================================

// Función para eliminar usuario por ID
User.delete = (id, result) => {

  // Consulta SQL para eliminar
  const sql = `DELETE FROM users WHERE id = ?`;

  // Ejecuta consulta
  db.query(sql, [id], (err, res) => {

    // Si ocurre error
    if (err) {

      console.log('Error al eliminar usuario: ', err);

      result(err, null);

    } else {

      // Muestra ID eliminado
      console.log('Usuario eliminado con id: ', id);

      // Retorna resultado
      result(null, res);
    }
  });
};


// Exporta el modelo User
module.exports = User;