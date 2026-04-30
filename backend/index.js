/* index.js: El archivo index.js es el punto de entrada del backend.
 Se encarga de cargar la aplicación principal, configurar el servidor HTTP, definir el puerto
  y la dirección IP donde se ejecutará, así como establecer la configuración de CORS para permitir 
  la comunicación con clientes externos. Finalmente, inicia el servidor para recibir solicitudes.*/

/*Se importan los módulos necesarios:
- http: permite crear el servidor manualmente.
- ./server: contiene la configuración principal de la aplicación Express.
- cors: middleware que permite controlar qué clientes pueden acceder al backend.*/
const http = require('http');
const app = require('./server');
const cors = require('cors');

/*Se definen el puerto y la dirección IP donde el servidor será ejecutado.
Se utilizan variables de entorno para mayor flexibilidad, permitiendo cambiar estos valores sin modificar el código.
Sería que esto permite que el backend funcione en diferentes entornos (local, red, producción) y así*/
const port = process.env.PORT || 3000;
const host = process.env.HOST || '10.1.196.175';

// Configuración CORS
/*Se configura el middleware CORS para permitir que ciertos orígenes (clientes) puedan consumir la API.
Se definen los métodos HTTP permitidos, los encabezados autorizados y el uso de credenciales.
Esto es importante para la comunicación entre frontend y backend.*/
app.use(cors({
  origin: [
    'http://10.1.196.175',
    'http://localhost', 
    'http://127.0.0.1'    
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Manejar preflight CORS
/*Se habilita la respuesta a solicitudes preflight (OPTIONS), 
necesarias para validar permisos antes de realizar peticiones reales en navegadores. 
Esto también vendría siendo como el navegador preguntando si puede hacer eso*/
app.options('*', cors());
/*Se almacena el puerto dentro de la aplicación Express para poder utilizarlo en otras partes del sistema si es necesario.*/
app.set('port', port);

/*Se crea un servidor HTTP utilizando la aplicación Express, permitiendo manejar las solicitudes entrantes.*/
const server = http.createServer(app);

/*Se inicia el servidor en la dirección y puerto definidos, permitiendo que el backend comience a recibir solicitudes.
Se muestra un mensaje en consola para confirmar que el servidor está activo.*/
server.listen(port, host, () => {
  console.log(`Servidor corriendo en http://${host}:${port}`);
});
