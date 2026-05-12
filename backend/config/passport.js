/* passport.js: Este archivo configura la autenticación JWT utilizando
la librería Passport. Su función es validar los tokens enviados por los usuarios,
buscar el usuario en la base de datos y permitir el acceso a rutas protegidas
si el token es válido. */

// Importamos la estrategia JWT de Passport
const JwtStrategy = require('passport-jwt').Strategy;

// Importamos la función para extraer el token desde el header Authorization
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Importamos passport
const passport = require('passport');

// Importamos la clave secreta del token
const Keys = require('./keys');

// Importamos el modelo de usuario para consultar la base de datos
const User = require('../models/user');

/* Configuración de opciones para JWT.
Define de dónde se obtiene el token y cuál es la clave secreta */
const opts = {

  /* Extrae el token desde el header Authorization.
  Espera un formato:
  Authorization: Bearer TOKEN */
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

  // Clave secreta utilizada para validar el token
  secretOrKey: Keys.secretOrKey
};

/* Configuramos la estrategia JWT de Passport.
Cada vez que llegue un token, Passport lo validará automáticamente */
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

  /* Busca el usuario en la base de datos utilizando
  el id almacenado dentro del token */
  User.findById(jwt_payload.id, (err, user) => {

    // Si ocurre un error en la consulta
    if (err) {
      return done(err, false);
    }

    // Si el usuario existe en la base de datos
    if (user) {

      /* done(null, user)
      null = no hubo error
      user = usuario autenticado */
      return done(null, user);
    }

    // Si el usuario no existe
    else{

      // false indica autenticación fallida
      return done(null, false);
    }
  });
}));

// Exportamos passport para utilizarlo en otras partes del proyecto
module.exports = passport;