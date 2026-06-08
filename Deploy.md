# 🚀 Guía Completa de Despliegue - E-commerce de Productos Tecnológicos

**Grupo Rojo** - E-commerce de Productos Tecnológicos

---

## 📋 Tabla de Contenidos

1. [Stack de Tecnologías](#stack-de-tecnologías)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación Paso a Paso](#instalación-paso-a-paso)
4. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
5. [Creación de Base de Datos](#creación-de-base-de-datos)
6. [Instalación de Dependencias](#instalación-de-dependencias)
7. [Ejecución del Backend](#ejecución-del-backend)
8. [Ejecución del Frontend](#ejecución-del-frontend)
9. [Seedeo de Datos Iniciales](#seedeo-de-datos-iniciales)
10. [Verificación de la Instalación](#verificación-de-la-instalación)
11. [Solución de Problemas](#solución-de-problemas)

---

## 🛠️ Stack de Tecnologías

### Backend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Node.js** | 16+ | Entorno de ejecución de JavaScript en servidor |
| **Express** | 5.2.1 | Framework minimalista para API REST |
| **TypeScript** | 5.9.3 | Lenguaje con tipado estático |
| **PostgreSQL** | 12+ | Base de datos relacional |
| **Prisma** | 7.4.0 | ORM type-safe para Node.js y TypeScript |
| **JWT** | 9.0.3 | Autenticación con tokens JSON Web Token |
| **bcrypt** | 6.0.0 | Hash seguro de contraseñas |
| **CORS** | 2.8.6 | Control de acceso entre orígenes |
| **Rate Limiting** | 8.2.1 | Limitación de peticiones por IP |
| **Nodemon** | 3.1.11 | Reinicio automático en desarrollo |

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **React** | 19.2.4 | Biblioteca de interfaz de usuario |
| **TypeScript** | 6.0.2 | Lenguaje con tipado estático |
| **Vite** | 8.0.4 | Bundler y dev server rápido |
| **React Router** | 7.14.0 | Enrutamiento en cliente |
| **Zustand** | 5.0.12 | Gestión de estado ligera |
| **Axios** | 1.15.0 | Cliente HTTP para peticiones |
| **Tailwind CSS** | 4.2.2 | Framework de estilos CSS |

---

## ✅ Requisitos Previos

Antes de iniciar, asegúrate de tener instalado:

### 1. Node.js y npm
```bash
# Descargar desde: https://nodejs.org/
# Verifica la instalación
node --version
npm --version
```

Mínimo requerido:
- Node.js v16 o superior
- npm v7 o superior

### 2. PostgreSQL
```bash
# Descargar desde: https://www.postgresql.org/download/
# Verifica la instalación
psql --version
```

Requisitos:
- PostgreSQL v12 o superior
- Usuario y contraseña configurados
- Acceso desde la máquina local

### 3. Git (Opcional pero recomendado)
```bash
git --version
```

---

## 🔧 Instalación Paso a Paso

### Paso 1: Clonar o Descargar el Repositorio

```bash
# Opción A: Clonar con Git
git clone https://github.com/tu-usuario/git-Ecommerce.git
cd git-Ecommerce

# Opción B: Descargar ZIP desde GitHub
# Extrae el archivo y accede a la carpeta
cd git-Ecommerce
```

### Paso 2: Preparar el Entorno

```bash
# Navega a la carpeta del proyecto
cd "D:\Repos Universidad\git-Ecommerce"

# Verifica la estructura
# Deberías ver:
# - Backend/
# - Frontend/
# - README.md
# - Deploy.md
```

### Paso 3: Configurar Variables de Entorno

Sigue la sección [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno) para crear los archivos `.env` necesarios.

### Paso 4: Crear la Base de Datos

Sigue la sección [Creación de Base de Datos](#creación-de-base-de-datos) para crear la BD en PostgreSQL.

### Paso 5: Instalar Dependencias

Sigue la sección [Instalación de Dependencias](#instalación-de-dependencias) para instalar npm packages en backend y frontend.

### Paso 6: Ejecutar Migraciones

```bash
# En la carpeta Backend/
npm run prisma:migrate
npm run prisma:generate
```

### Paso 7: Seedear Base de Datos

```bash
# En la carpeta Backend/
npm run prisma:seed
```

### Paso 8: Levantar Servicios

Abre dos terminales:

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

---

## 🔐 Configuración de Variables de Entorno

### Backend - Archivo `.env`

Crea el archivo `Backend/.env` con el siguiente contenido:

```env
# ====================================
# SERVIDOR
# ====================================
PORT=3400
ENVIRONMENT=development

# ====================================
# BASE DE DATOS (PostgreSQL)
# ====================================
# Formato: postgresql://usuario:contraseña@host:puerto/nombre_base_datos
DB_URL=postgresql://tu_usuario:tu_contraseña@localhost:5432/ecommerce_db

# ====================================
# SEGURIDAD - CONTRASEÑAS
# ====================================
# Número de rondas de bcrypt (10 es el estándar recomendado)
SALTG_PSWD=10

# ====================================
# AUTENTICACIÓN - JWT TOKENS
# ====================================
# Claves secretas para firmar tokens (usa valores aleatorios fuertes)
FIRMA_ACCESS_TOKEN=tu_clave_secreta_access_token_muy_larga_y_aleatoria_123456
FIRMA_REFRESH_TOKEN=tu_clave_secreta_refresh_token_muy_larga_y_aleatoria_789012

# Duración de los tokens
ACCESS_TOKEN_DURATION=30min
REFRESH_TOKEN_DURATION=8d
```

**⚠️ IMPORTANTE:** 
- Cambia `tu_usuario`, `tu_contraseña` y el nombre de la base de datos según tu configuración de PostgreSQL
- Las claves de JWT deben ser muy largas y aleatorias (mínimo 32 caracteres)
- **NUNCA** compartas o subas el archivo `.env` a control de versiones
- El `.env` ya está en `.gitignore`, así que está seguro

### Frontend - Archivo `.env`

El archivo `Frontend/.env` ya existe. Verifica que contenga:

```env
# URL del backend (ajusta el puerto si es necesario)
VITE_API_URL=http://localhost:3400/api
```

Si necesitas cambiar el puerto del backend, actualiza este valor.

---

## 📊 Creación de Base de Datos

### Opción 1: Crear Base de Datos manualmente (Recomendado)

#### En Windows con pgAdmin (GUI):

1. Abre **pgAdmin** (instalado con PostgreSQL)
2. Conéctate con tus credenciales
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `ecommerce_db`
5. Click "Save"

#### En Terminal con psql:

```bash
# Abre la consola de PostgreSQL
psql -U postgres

# Dentro de psql:
CREATE DATABASE ecommerce_db;
\l  # Verifica que se creó

# Salir
\q
```

### Opción 2: Crear Base de Datos con Prisma

Si tienes el archivo `.env` configurado correctamente:

```bash
cd Backend

# Prisma creará la BD automáticamente si no existe
npm run prisma:migrate
```

---

## 📦 Instalación de Dependencias

### Backend - Instalación de npm packages

```bash
# Navega a la carpeta Backend
cd Backend

# Instala todas las dependencias
npm install

# Verifica que se instaló correctamente
npm list

# Output esperado: debería listar todas las dependencias
```

### Frontend - Instalación de npm packages

```bash
# Navega a la carpeta Frontend (desde la raíz del proyecto)
cd Frontend

# Instala todas las dependencias
npm install

# Verifica que se instaló correctamente
npm list
```

### Solución de Problemas de Instalación

Si encuentras errores:

```bash
# Limpiar cachés
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -r node_modules  # En Windows: rmdir /s /q node_modules
npm install

# Verificar versiones de Node y npm
node --version
npm --version
```

---

## 🔧 Ejecución del Backend

### Paso 1: Configurar la Base de Datos

```bash
cd Backend

# Crear migraciones (si es la primera vez)
npm run prisma:migrate

# Generar cliente de Prisma
npm run prisma:generate

# Seedear datos iniciales (crear roles, usuarios, categorías)
npm run prisma:seed
```

### Paso 2: Ejecutar el Backend

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Salida esperada:
# Servidor escuchando en puerto 3400
# Base de datos conectada
```

### Paso 3: Verificar que está corriendo

En tu navegador o Postman, accede a:
```
http://localhost:3400/api
```

### Comandos Útiles del Backend

```bash
# Compilar TypeScript
npm run build

# Ejecutar en modo producción
npm start

# Abrir Prisma Studio (GUI para explorar BD)
npx prisma studio --schema=src/prisma/schema.prisma

# Resetear base de datos (⚠️ Elimina todos los datos)
npx prisma migrate reset --schema=src/prisma/schema.prisma

# Ver estado de migraciones
npx prisma migrate status --schema=src/prisma/schema.prisma
```

---

## 🎨 Ejecución del Frontend

### Paso 1: Instalar dependencias (si no lo has hecho)

```bash
cd Frontend
npm install
```

### Paso 2: Ejecutar en modo desarrollo

```bash
npm run dev

# Salida esperada:
# VITE v8.0.4  ready in XXX ms
# ➜  Local:   http://localhost:5173/
# ➜  Press h to show help
```

### Paso 3: Acceder a la aplicación

Abre tu navegador en:
```
http://localhost:5173
```

### Comandos Útiles del Frontend

```bash
# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Linting y verificación de código
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

---

## 🌱 Seedeo de Datos Iniciales

El archivo `seed.ts` prepara la base de datos con datos iniciales:

### Datos que se crean:

1. **Roles** (3):
   - `admin` - Administrador del sistema
   - `seller` - Vendedor de productos
   - `buyer` - Comprador

2. **Usuarios de Prueba** (3):
   - Email: `admin@test.com` → Rol: Admin
   - Email: `seller@test.com` → Rol: Seller
   - Email: `buyer@test.com` → Rol: Buyer
   - **Contraseña**: `123456` (para todos)

3. **Categorías** (9):
   - Peticiones, Quejas, Sugerencias, Reclamos, Información
   - Electrónica, Smartphones, Computadoras, Accesorios

4. **Tipos de Notificación** (5):
   - Email, Carta, Presencial, Telefónico, Digital

5. **Estados de Notificación** (5):
   - Pendiente, En Proceso, Respondida, Cerrada, Rechazada

6. **Notificaciones de Ejemplo** (10):
   - Ejemplos de notificaciones para probar el sistema

### Ejecutar el seed:

```bash
cd Backend

# Ejecuta el archivo seed.ts
npm run prisma:seed

# Salida esperada:
# Iniciando seed...
# Roles creados.
# Usuarios creados (password de todos: 123456).
# Categorias creadas.
# Tipos de notificacion creados.
# Estados de notificacion creados.
# 10 notificaciones de ejemplo creadas.
# Seed completado correctamente.
```

### Credenciales de Prueba

Después de ejecutar el seed, puedes iniciar sesión con:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@test.com | 123456 | Admin |
| seller@test.com | 123456 | Seller |
| buyer@test.com | 123456 | Buyer |

### Resetear el seed (si lo necesitas)

```bash
# Opción 1: Ejecutar seed nuevamente (es idempotente)
npm run prisma:seed

# Opción 2: Resetear toda la base de datos
npx prisma migrate reset --schema=src/prisma/schema.prisma
# (Esto borrará todos los datos y volverá a ejecutar todas las migraciones y el seed)
```

---

## ✅ Verificación de la Instalación

### 1. Verificar Backend

```bash
# Terminal 1: Levanta el backend
cd Backend
npm run dev

# Terminal 2: Prueba el endpoint
curl http://localhost:3400/api

# O accede desde Postman:
GET http://localhost:3400/api
```

### 2. Verificar Frontend

```bash
# Accede a:
http://localhost:5173

# Deberías ver la aplicación React cargada
```

### 3. Verificar Conectividad Backend-Frontend

1. Abre el navegador en `http://localhost:5173`
2. Abre las Developer Tools (F12)
3. Ve a la pestaña "Network"
4. Realiza una acción que haga peticiones al backend
5. Verifica que las peticiones a `http://localhost:3400/api/*` tengan respuesta 200

### 4. Pruebas de Endpoints principales

```bash
# Listar usuarios
curl http://localhost:3400/api/usuarios/consultar

# Login (reemplaza con datos reales)
curl -X POST http://localhost:3400/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","contrasena":"123456"}'

# Consultar un usuario
curl http://localhost:3400/api/usuarios/consultar?email=admin@test.com
```

---

## 🆘 Solución de Problemas

### ❌ Error: "Cannot find module 'dotenv'"

**Solución:**
```bash
# Backend
cd Backend
npm install

# Frontend
cd Frontend
npm install
```

### ❌ Error: "Port 3400 is already in use"

**Solución:**
```bash
# Cambiar el puerto en Backend/.env
PORT=3401  # O cualquier otro puerto disponible

# Luego actualiza la URL en Frontend/.env
VITE_API_URL=http://localhost:3401/api
```

### ❌ Error: "Database connection failed"

**Verifica:**
1. PostgreSQL está corriendo
2. Las credenciales en `Backend/.env` son correctas
3. La base de datos existe
4. No hay firewall bloqueando la conexión a PostgreSQL

```bash
# Prueba la conexión
psql -U tu_usuario -h localhost -d ecommerce_db
```

### ❌ Error: "EADDRINUSE: address already in use :::5173"

**Solución:**
```bash
# El puerto 5173 ya está en uso
# Opción 1: Cambiar puerto en vite.config.ts
# Opción 2: Matar el proceso que usa el puerto

# En Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# En Linux/Mac:
lsof -i :5173
kill -9 <PID>
```

### ❌ Error: "Prisma client is not generated"

**Solución:**
```bash
cd Backend
npm run prisma:generate

# O si aún no tienes migraciones:
npm run prisma:migrate
npm run prisma:generate
```

### ❌ Error: "Cannot login / Invalid credentials"

**Verifica:**
1. Has ejecutado el seed: `npm run prisma:seed`
2. Las credenciales son las correctas (ver tabla arriba)
3. No hay caracteres invisibles en el email/contraseña

### ❌ CORS error en el navegador

**Solución:**
Verifica que `Backend/src/server.ts` tiene CORS habilitado:

```typescript
import cors from 'cors';
app.use(cors());
```

Si aún falla, especifica los orígenes permitidos:
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### ❌ TypeScript errors en el editor

**Solución:**
```bash
# Limpiar caché de TypeScript
rm -r node_modules/.cache  # Linux/Mac
rmdir /s /q node_modules\.cache  # Windows

# Reinstalar
npm install

# Reinicia el editor
```

---

## 📈 Estructura de Directorios Generada

Después de completar la instalación, tu estructura debería verse así:

```
git-Ecommerce/
├── Backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── modules/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── seed.ts
│   │   │   └── prisma.client.ts
│   │   └── router/
│   ├── prisma/
│   │   └── migrations/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── .env (⚠️ no en versión control)
│   └── README.md
│
├── Frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── components/
│   ├── public/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .env
│   └── README.md
│
├── Deploy.md (este archivo)
├── README.md
└── .gitignore
```

---

## 🚀 Próximos Pasos

Después de completar la instalación:

1. **Explorar la aplicación**: Accede a `http://localhost:5173` y navega
2. **Consultar la API**: Lee `Backend/README.md` para endpoints disponibles
3. **Customizar**: Modifica estilos en `Frontend/src` y lógica en `Backend/src`
4. **Testing**: Crea pruebas unitarias e integración
5. **Deployment**: Cuando esté listo, despliega a producción

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la sección [Solución de Problemas](#solución-de-problemas)
2. Consulta `Backend/README.md` para detalles de la API
3. Consulta `Frontend/README.md` para detalles del frontend
4. Verifica los archivos de configuración (`.env`, `tsconfig.json`, `vite.config.ts`)

---

## 📝 Autor y Licencia

**Desarrollado por**: Grupo Rojo  
**Licencia**: ISC

---

**¡Listo! Tu e-commerce está configurado y funcionando.** 🎉
