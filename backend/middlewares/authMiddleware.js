/* authMiddleware.js: Este archivo contiene los middlewares de autenticación
y autorización del sistema. Su función es verificar que el usuario tenga
un token JWT válido y comprobar si posee los permisos necesarios según su rol,
antes de permitir el acceso a las rutas protegidas del backend. */

// Importamos la librería jsonwebtoken para trabajar con tokens JWT
const jwt = require("jsonwebtoken");

// Importamos la clave secreta desde el archivo de configuración
const keys = require("../config/keys");

/* Middleware encargado de verificar si el usuario envió un token válido.
Se ejecuta antes de entrar a ciertas rutas protegidas */
function verifyToken(req, res, next) {

  // Obtiene el encabezado Authorization enviado desde Postman o frontend
  const authHeader = req.headers["authorization"];

  // Si no existe el encabezado Authorization, se niega el acceso
  if (!authHeader) {
    return res.status(403).json({
      success: false,
      message: "No se proporcionó un token",
    });
  }

  /* Divide el contenido del Authorization.
  Ejemplo:
  "JWT abc123"
  split(" ") separa por espacio:
  [0] = JWT
  [1] = abc123 */
  const token = authHeader.split(" ")[1];

  // Verifica que el token realmente exista
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Formato de token inválido",
    });
  }

  /* Verifica si el token fue firmado correctamente usando
  la clave secreta del sistema */
  jwt.verify(token, keys.secretOrKey, (err, decoded) => {

    // Si el token expiró o es inválido, se bloquea el acceso
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token inválido o expirado",
        error: err,
      });
    }

    /* Guarda la información decodificada del token
    dentro de req.user para usarla en otras rutas */
    req.user = decoded;

    // Permite continuar hacia el siguiente middleware o controller
    next();
  });
}

/* Middleware encargado de validar los roles del usuario.
Recibe un arreglo de roles permitidos */
function authorizeRoles(roles) {

  // Retorna otro middleware
  return (req, res, next) => {

    /* Verifica si el usuario existe y si su rol está
    dentro de los roles permitidos */
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: se requiere rol ${roles.join(" o ")}`,
      });
    }

    // Si tiene permisos, continúa hacia la ruta
    next();
  };
}

/* Exportamos los middlewares para poder utilizarlos
en las rutas protegidas */
module.exports = {
  verifyToken,
  authorizeRoles,
};