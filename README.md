📌 Administración de Pacientes de Veterinaria - Backend

Este es el servicio backend del proyecto Vet Manager, creado con Node.js, Express y MongoDB.
Proporciona autenticación, admisión y seguimiento de pacientes, y edición de perfil.

🚀 Características

- Autenticación de Usuarios (JWT)
- Administración de Pacientes (CRUD)
- Recuperación de Pacientes desde:
    - MongoDB (datos locales)
- Rutas Públicas y Privadas
- Envío de emails con nodemailer (solo en desarrollo)
- Middleware para autenticación de JWT y manejo de errores

🛠 Tecnologías Aplicadas

- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- Llamados API a través de Axios
- Nodemailer (solo desarrollo)
- Variables de Entorno

📂 Estructura del Proyecto

backend/

- controllers/      # Lógica aplicable a cada ruta
    - pacienteController.js
    - veterinarioController.js
- routes/           # Definición de rutas de la API
    - pacienteRoutes.js
    - veterinarioRoutes.js
- models/           # Estructura de la base de datos (Schema) para veterinarios y pacientes
    - Paciente.js
    - Veterinario.js
- helpers/          # Funciones auxiliares (nodemailer, generación de ID / JWT)
    - emailOlvidePassword.js
    - emailRegistro.js
    - generarId.js
    - generarJWT.js
- middleware/       # Funciones Middleware (Verficación JWT)
    - authMiddleware.js
- config/           # Configuración de la base de datos
    - db.js
- .env              # Variables de entorno
- index.js          # Punto de entrada

⚙️ Instalación y Configuración

1. Clona el repositorio

git clone https://github.com/aescamilla9804/mern_vet_backend_deploy.git
cd anime-api-backend

2. Instala las dependencias

npm install

3. Configura las variables de entorno

MONGO_URI=your_mongodb_cluster
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:####
EMAIL_HOST=your_sandbox_host
EMAIL_PORT=your_sandbox_port
EMAIL_USER=your_sandbox_user
EMAIL_PASS=your_sandbox_password

4. Corre el servidor en modo desarrollo

npm run dev

📡 Rutas API

Veterinarios

Método	    Enlace	                                     Acceso	         Descripción
POST	    /api/veterinarios/	                         Público	     Registrar un nuevo veterinario
GET	        /api/veterinarios/confirmar/:token	         Público	     Confirmación de cuenta
POST	    /api/veterinarios/login	                     Público	     Inicio de sesión
POST        /api/veterinarios/olvide-password            Público         Solicitur cambio de contraseña
GET         /api/veterinarios/olvide-password/:token     Público         Lectura de token
POST        /api/veterinarios/olvide-password/:token     Público         Cambio de contraseña
GET         /api/veterinarios/perfil                     Privado         Obtener datos del veterinario
PUT         /api/veterinarios/perfil/:id                 Privado         Editar información del veterinario
PUT         /api/veterinarios/actualizar-password        Privado         Cambiar contraseña del veterinario


Pacientes

Método	    Enlace                  Acceso	     Descripción
POST	    /api/pacientes/	        Privado	     Registrar un nuevo paciente
GET	        /api/pacientes/	        Privado	     Obtener datos de los pacientes
GET	        /api/pacientes/:id	    Privado	     Obtener datos de un paciente en particular
PUT	        /api/pacientes/:id	    Privado	     Modificar datos de un paciente en particular
DELETE	    /api/pacientes/:id	    Privado	     Eliminar registro de un paciente en particular

📧 Envío de email en Developement

El envío de correos para confiramción de cuentas está disponible únicamente en la etapa de desarrollo.
Si deseas testear la función de envío de emails deberías modificar el valor de las siguientes variables de entorno:

- EMAIL_HOST
- EMAIL_PORT
- EMAIL_USER
- EMAIL_PASS

🧪 Pruebas con cuentas Demo

Este proyecto cuenta con algunas cuentas demo para realizar pruebas:

- Email: demo@example.com | Password: Demo123#
- Email: demo2@example.com | Password: Demo123#

🔒 Autenticación

Todas las rutas privadas deben requieren de un JWT que se debe leer en el encabezado de la siguiente manera:

Authorization: Bearer <your_token_here>

📜 Licencia

Este proyecto está licenciado bajo la licencia MIT