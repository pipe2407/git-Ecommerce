# Backend - E-commerce API

API REST para gestionar un proyecto de e-commerce orientado a la venta de productos tecnológicos.

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Comandos Disponibles](#comandos-disponibles)
- [API Endpoints](#api-endpoints)
- [Modelos de Datos](#modelos-de-datos)

## 🚀 Tecnologías

### Framework y Lenguaje
- **Node.js**: Entorno de ejecución de JavaScript
- **TypeScript**: Superset de JavaScript con tipado estático
- **Express**: Framework minimalista para construir APIs REST
  - Servidor HTTP rápido y flexible
  - Middleware para CORS, Rate Limiting y manejo de JSON
  - Routing modular y escalable

### ORM y Base de Datos
- **Prisma**: ORM de próxima generación para Node.js y TypeScript
  - Type-safe database client
  - Migraciones automáticas
  - Introspección de base de datos
  - Generación de cliente basado en el schema
- **PostgreSQL**: Base de datos relacional
- **@prisma/adapter-pg**: Adaptador de PostgreSQL para Prisma

### Autenticación y Seguridad
- **jsonwebtoken**: Generación y validación de tokens JWT
  - Access tokens para autenticación de sesiones
  - Refresh tokens para renovación de acceso
- **bcrypt**: Hash de contraseñas con salt
- **express-rate-limit**: Limitación de peticiones por IP (100 req/15min)
- **cors**: Habilitación de Cross-Origin Resource Sharing

### Herramientas de Desarrollo
- **nodemon**: Reinicio automático del servidor en desarrollo
- **ts-node**: Ejecución directa de TypeScript sin compilar
- **dotenv**: Gestión de variables de entorno

## 📁 Estructura del Proyecto

```
Backend/
├── src/
│   ├── app.ts                    # Punto de entrada de la aplicación
│   ├── server.ts                 # Configuración del servidor Express
│   ├── config/
│   │   └── env.ts               # Variables de entorno
│   ├── modules/                 # Módulos de la aplicación
│   │   ├── Auth/               # Autenticación
│   │   │   ├── Models/
│   │   │   ├── Repository/
│   │   │   └── Services/
│   │   └── usuarios/           # Gestión de usuarios
│   │       ├── Controller/     # Controladores de endpoints
│   │       ├── Models/         # Interfaces y tipos
│   │       ├── Repository/     # Capa de acceso a datos
│   │       ├── Routes/         # Definición de rutas
│   │       └── Services/       # Lógica de negocio
│   ├── prisma/
│   │   ├── schema.prisma       # Schema de Prisma
│   │   └── prisma.client.ts    # Cliente de Prisma configurado
│   ├── router/
│   │   └── router.ts           # Router principal
│   └── generated/              # Cliente de Prisma generado
├── prisma/
│   └── migrations/             # Migraciones de base de datos
├── package.json
└── tsconfig.json
```

## 📦 Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- PostgreSQL
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd Backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto (ver [Variables de Entorno](#variables-de-entorno))

4. **Configurar la base de datos**
```bash
# Sincronizar schema con la base de datos existente
npm run prisma:pull

# O crear migraciones nuevas
npm run prisma:migrate
```

5. **Generar el cliente de Prisma**
```bash
npm run prisma:generate
```

6. **Iniciar el servidor**
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
```

## 🔐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# Conexión a la base de datos
DB_URL=postgresql://usuario:contraseña@localhost:5432/nombre_db

# Entorno de ejecución
ENVIRONMENT=development

# Seguridad de contraseñas (número de rondas de bcrypt)
SALTG_PSWD=10

# Firma para tokens JWT
FIRMA_ACCESS_TOKEN=tu_clave_secreta_access_token
FIRMA_REFRESH_TOKEN=tu_clave_secreta_refresh_token

# Duración de tokens
ACCESS_TOKEN_DURATION=30min
REFRESH_TOKEN_DURATION=8d
```

## ⚙️ Comandos Disponibles

### Desarrollo
```bash
# Iniciar servidor en modo desarrollo con hot-reload
npm run dev
```

### Producción
```bash
# Compilar TypeScript a JavaScript
npm run build

# Iniciar servidor en modo producción
npm start
```

### Prisma

```bash
# Instalar paquetes
npm install

# Sincronizar el schema de Prisma con la base de datos existente
npm run prisma:pull

# Generar el cliente de Prisma (necesario después de cambios en schema.prisma)
npm run prisma:generate

# Crear y aplicar una migración
npm run prisma:migrate

# Abrir Prisma Studio (GUI para explorar la base de datos)
npx prisma studio --schema=src/prisma/schema.prisma

# Formatear el archivo schema.prisma
npx prisma format --schema=src/prisma/schema.prisma

# Validar el schema de Prisma
npx prisma validate --schema=src/prisma/schema.prisma

# Resetear la base de datos (⚠️ elimina todos los datos)
npx prisma migrate reset --schema=src/prisma/schema.prisma
```

### Otros
```bash
# Ejecutar tests
npm test
```

## 🌐 API Endpoints

Base URL: `http://localhost:3000/api`

### Módulo: Usuarios

#### 1. Crear Usuario
Registra un nuevo usuario en el sistema.

**Endpoint:** `POST /api/usuarios/crear`

**Request Body:**
```json
{
  "usuario_crea_fk": 1,
  "usuario_modifica_fk": 1,
  "primer_nombre": "Juan",
  "segundo_nombre": "Carlos",
  "primer_apellido": "Pérez",
  "segundo_apellido": "González",
  "numero_identificacion": "1234567890",
  "email": "juan.perez@example.com",
  "contrasena": "contraseña_segura"
}
```

**Campos:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| usuario_crea_fk | number | Sí | ID del usuario que crea el registro |
| usuario_modifica_fk | number | Sí | ID del usuario que modifica el registro |
| primer_nombre | string | Sí | Primer nombre del usuario |
| segundo_nombre | string | No | Segundo nombre del usuario |
| primer_apellido | string | Sí | Primer apellido del usuario |
| segundo_apellido | string | No | Segundo apellido del usuario |
| numero_identificacion | string | Sí | Número de identificación (máx. 10 caracteres) |
| email | string | Sí | Correo electrónico único |
| contrasena | string | Sí | Contraseña (será hasheada con bcrypt) |

**Response (201 - Created):**
```json
{
  "id": 5,
  "primer_nombre": "Juan",
  "segundo_nombre": "Carlos",
  "primer_apellido": "Pérez",
  "segundo_apellido": "González",
  "numero_identificacion": "1234567890",
  "email": "juan.perez@example.com",
  "activo": true,
  "fecha_crea": "2026-02-26T12:00:00.000Z",
  "fecha_modifica": "2026-02-26T12:00:00.000Z"
}
```

**Response (500 - Error):**
```json
{
  "error": "Error al crear usuario",
  "mensaje": "Email ya existe en el sistema"
}
```

---

#### 2. Consultar Usuario
Consulta información de usuarios según parámetros de búsqueda.

**Endpoint:** `GET /api/usuarios/consultar`

**Query Parameters:**
```
?email=juan.perez@example.com
?numero_identificacion=1234567890
?id=5
```

**Parámetros disponibles:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | number | ID del usuario |
| email | string | Email del usuario |
| numero_identificacion | string | Número de identificación |
| activo | boolean | Estado del usuario |

**Response (200 - OK):**
```json
{
  "message": "Usuario Creado"
}
```

**Response (500 - Error):**
```json
{
  "error": "Error al consultar usuario",
  "mensaje": "Usuario no encontrado"
}
```

---

#### 3. Login de Usuario
Autentica un usuario y genera tokens de acceso.

**Endpoint:** `POST /api/usuarios/login`

**Request Body:**
```json
{
  "email": "juan.perez@example.com",
  "contrasena": "contraseña_segura"
}
```

**Campos:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| email | string | Sí | Correo electrónico del usuario |
| contrasena | string | Sí | Contraseña del usuario |

**Response (200 - OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Headers de Response:**
```
Set-Cookie: refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict
```

**Información del Token:**
- **Access Token**: JWT válido por 30 minutos (configurable)
  - Incluye: nombre de usuario, identificación y permisos
- **Refresh Token**: JWT válido por 8 días (configurable)
  - Se envía como cookie HttpOnly para mayor seguridad
  - Se almacena en la base de datos con IP y User-Agent

**Response (401 - Unauthorized):**
```json
{
  "error": "Error al autenticar usuario",
  "mensaje": "Credenciales inválidas"
}
```

**Payload del Access Token:**
```json
{
  "nombre_usuario": "Juan Pérez",
  "identificacion": "1234567890",
  "permisos": {
    "ADMIN": ["CREAR_USUARIO", "EDITAR_USUARIO", "ELIMINAR_USUARIO"],
    "VENDEDOR": ["CREAR_PRODUCTO", "VER_PRODUCTOS"]
  }
}
```

## 🔒 Características de Seguridad

### Autenticación
- Contraseñas hasheadas con bcrypt (10 salts por defecto)
- Sistema de doble token (Access + Refresh)
- Refresh tokens almacenados con IP y User-Agent para mayor control
- Cookies HttpOnly para prevenir ataques XSS

### Rate Limiting
- Límite de 100 peticiones por cada 15 minutos por IP
- Protección contra ataques de fuerza bruta y DDoS

### CORS
- Configuración de CORS para controlar orígenes permitidos

### Validación
- Validación de tipos con TypeScript
- Email único en la base de datos
- Restricciones de longitud en campos

---
Implementa un sistema RBAC (Role-Based Access Control):
- Los usuarios tienen roles
- Los roles tienen permisos
- Los permisos definen acciones específicas

---

## 👨‍💻 Autor

**Edilson Luna**

---

## 📝 Licencia

ISC

---