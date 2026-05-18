# API REST con Express - Gestión de tareas (mvc)

## Descripción del Proyecto

Este proyecto consiste en el desarrollo de una API REST para la gestión de tareas utilizando **Node.js y Express**, implementada siguiendo el patrón de arquitectura **MVC (Modelo - Controlador)**.

La API permite realizar operaciones CRUD sobre tareas utilizando una lista en memoria como almacenamiento temporal. Cada tarea contiene un identificador, un título y un estado que indica si la tarea está completada o no.

Los datos se intercambian en formato **JSON** mediante diferentes endpoints que permiten crear, consultar, actualizar y eliminar tareas.

El sistema utiliza una base de datos relacional para garantizar la integridad de la información:

* **Base de Datos**: MariaDB / MySQL.
* **ORM**: Sequelize para la definición de modelos y migraciones automáticas.
* **Unificación de Identidad**: Gestión centralizada de perfiles y credenciales en una tabla única (`usuarios`), permitiendo que una `Persona` sea a la vez un usuario del sistema.
* **Relaciones**: Soporte para asociaciones Muchos a Muchos (Tags-Tareas) y Uno a Muchos (Usuarios-Tareas).

## Seguridad y Autenticación

La API implementa múltiples capas de seguridad para proteger los recursos:

* **JWT (JSON Web Tokens)**: Autenticación basada en tokens firmados.
* **Cookies HTTP-Only**: Almacenamiento seguro del JWT para mitigar ataques XSS.
* **RBAC (Control de Acceso Basado en Roles)**: Middleware especializado para restringir rutas de administración solo a usuarios con el rol `admin`.
* **Google OAuth 2.0**: Integración con Passport.js para login social.
* **Bcrypt**: Encriptación de contraseñas mediante hooks de Sequelize antes de la persistencia.
* **API Key**: Validación de cabecera `x-api-key` para asegurar que las peticiones provienen de clientes autorizados.
### Configuración de Variables de Entorno (.env)
Para el correcto funcionamiento del sistema, es obligatorio contar con un archivo `.env` en la raíz del directorio con los siguientes parámetros:

```env
PORT=3000
API_KEY=tu_clave_api_secreta
JWT_SECRET=tu_firma_secreta_jwt
JWT_EXPIRES_IN=1h
COOKIE_MAX_AGE=3600000
NODE_ENV=development
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=https://localhost:3000/auth/google/callback
```

## Instalación

Para instalar las dependencias del proyecto ejecutar:

```bash
npm install
```


## Ejecutar el Proyecto

Para iniciar el servidor ejecutar:

```bash
npm run dev
```

El servidor se ejecutará en:

```
http://localhost:3000
```


## Endpoints Disponibles

GET /api/tareas

GET /api/tareas/buscar?titulo=nombre

GET /api/tareas/:id

POST /api/tareas

PUT /api/tareas/:id

PATCH /api/tareas/:id

DELETE /api/tareas/:id


