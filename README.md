# 🛒 E-commerce de Productos Tecnológicos

**Grupo Rojo** - Proyecto académico de e-commerce completo

---

## 👥 Integrantes

- Daiber Arley Mantilla Carreño
- Juan Felipe Pinto Sandoval
- Víctor Ricardo Serpa Núñez
- **Edilson Andrés Luna Herrera** (Líder)
- Brandon Dulian Gracias Suárez

---

## 📋 Descripción General

Este es un **proyecto full-stack** de un e-commerce especializado en la venta de productos tecnológicos. Cuenta con:

- ✅ **Frontend moderno** con React, TypeScript y Vite
- ✅ **API REST escalable** con Node.js, Express y PostgreSQL
- ✅ **Autenticación y autorización** con JWT y roles
- ✅ **Gestión de base de datos** con Prisma ORM
- ✅ **Interfaz responsive** con Tailwind CSS
- ✅ **Sistema de órdenes** y pagos
- ✅ **Panel de administrador** para gestión de productos
- ✅ **Sistema de notificaciones** y auditoría

---

## 🗂️ Estructura del Proyecto

```
git-Ecommerce/
│
├── 📁 Backend/                 # API REST con Node.js + Express
│   ├── src/
│   │   ├── app.ts              # Punto de entrada
│   │   ├── modules/            # Módulos de negocio
│   │   ├── prisma/             # Configuración de BD
│   │   │   ├── schema.prisma   # Modelo de datos
│   │   │   └── seed.ts         # Datos iniciales
│   │   └── config/             # Configuración
│   ├── package.json
│   ├── .env (no en git)        # Variables de entorno
│   └── README.md               # Documentación del backend
│
├── 📁 Frontend/                # SPA con React + TypeScript
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas/vistas
│   │   ├── store/              # Estado global (Zustand)
│   │   ├── services/           # Peticiones HTTP
│   │   └── types/              # Interfaces TypeScript
│   ├── package.json
│   ├── .env                    # Variables de entorno
│   ├── vite.config.ts          # Configuración de Vite
│   └── README.md               # Documentación del frontend
│
├── Deploy.md                   # 🔥 GUÍA COMPLETA DE INSTALACIÓN
├── README.md                   # Este archivo
└── .gitignore
```

---

## 🛠️ Stack Tecnológico

### Backend
```
Node.js + Express + TypeScript
        ↓
    PostgreSQL (Prisma ORM)
        ↓
    JWT Authentication + bcrypt
        ↓
    RESTful API
```

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Runtime** | Node.js | 16+ |
| **Framework** | Express | 5.2.1 |
| **Lenguaje** | TypeScript | 5.9.3 |
| **BD** | PostgreSQL | 12+ |
| **ORM** | Prisma | 7.4.0 |
| **Auth** | JWT + bcrypt | 9.0.3 / 6.0.0 |
| **Dev** | Nodemon, ts-node | 3.1.11 / 10.9.2 |

### Frontend
```
React + TypeScript + Vite
        ↓
    React Router + Zustand
        ↓
    Axios (HTTP Client)
        ↓
    Tailwind CSS (Styling)
```

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Framework** | React | 19.2.4 |
| **Lenguaje** | TypeScript | 6.0.2 |
| **Bundler** | Vite | 8.0.4 |
| **Routing** | React Router | 7.14.0 |
| **Estado** | Zustand | 5.0.12 |
| **HTTP** | Axios | 1.15.0 |
| **CSS** | Tailwind CSS | 4.2.2 |

---

## 🚀 Inicio Rápido (5 minutos)

### Requisitos Previos
- Node.js v16+
- PostgreSQL v12+
- npm/yarn

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/git-Ecommerce.git
cd git-Ecommerce
```

### 2️⃣ Configurar Backend
```bash
cd Backend

# Instalar dependencias
npm install

# Crear archivo .env (ver sección Variables de Entorno)
# Copiar contenido de ejemplos en Deploy.md

# Crear base de datos PostgreSQL
# psql -U postgres
# CREATE DATABASE ecommerce_db;

# Migraciones y seed
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed

# Iniciar servidor
npm run dev
# El backend está en http://localhost:3400
```

### 3️⃣ Configurar Frontend
```bash
# Desde la raíz del proyecto
cd Frontend

# Instalar dependencias
npm install

# El .env ya existe con VITE_API_URL

# Iniciar servidor de desarrollo
npm run dev
# La app está en http://localhost:5173
```

### 4️⃣ Verificar Instalación
```bash
# Abre dos terminales:
# Terminal 1: cd Backend && npm run dev
# Terminal 2: cd Frontend && npm run dev

# Accede a: http://localhost:5173

# Credenciales de prueba:
# Email: admin@test.com
# Contraseña: 123456
```

**👉 Para guía completa con troubleshooting, ver [Deploy.md](./Deploy.md)**

---

## 📖 Documentación Detallada

### Documentación por Componente

| Componente | Documentación | Contenido |
|-----------|----------------|----------|
| **🔥 Instalación Completa** | [Deploy.md](./Deploy.md) | Paso a paso, variables .env, troubleshooting |
| **🔧 Backend** | [Backend/README.md](./Backend/README.md) | API endpoints, modelos, autenticación |
| **🎨 Frontend** | [Frontend/README.md](./Frontend/README.md) | Componentes, hooks, rutas, gestión de estado |

---

## 🔐 Variables de Entorno

### Backend - `.env`
```env
PORT=3400
ENVIRONMENT=development
DB_URL=postgresql://usuario:contraseña@localhost:5432/ecommerce_db
SALTG_PSWD=10
FIRMA_ACCESS_TOKEN=tu_clave_secreta_aqui
FIRMA_REFRESH_TOKEN=tu_clave_secreta_aqui
ACCESS_TOKEN_DURATION=30min
REFRESH_TOKEN_DURATION=8d
```

**Nota**: El archivo `.env` está en `.gitignore` y no se sube a GitHub.

### Frontend - `.env`
```env
VITE_API_URL=http://localhost:3400/api
```

---

## 📚 Características Principales

### Módulo de Autenticación
- ✅ Login/Registro de usuarios
- ✅ JWT Access + Refresh tokens
- ✅ Roles y permisos (RBAC)
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Rate limiting en endpoints

### Catálogo de Productos
- ✅ Listado con paginación
- ✅ Búsqueda y filtros
- ✅ Categorías
- ✅ Carrito persistente
- ✅ Detalle completo de producto

### Sistema de Órdenes
- ✅ Crear órdenes desde carrito
- ✅ Historial de órdenes
- ✅ Estados de orden (pendiente, procesada, enviada, entregada)
- ✅ Información de entrega y pago

### Dashboard Admin
- ✅ Gestión de productos (CRUD)
- ✅ Gestión de órdenes
- ✅ Reportes de ventas
- ✅ Auditoria de acciones

### Sistema de Notificaciones
- ✅ Notificaciones de sistema
- ✅ Historial de mensajes
- ✅ Diferentes tipos y estados
- ✅ Categorización de notificaciones

---

## 🔄 Flujo de Datos

```
┌─────────────┐
│   Browser   │
│  (React UI) │
└──────┬──────┘
       │ (HTTP/AJAX)
       ↓
┌─────────────────────────────────┐
│  Frontend (Port 5173)           │
│  - React Router                 │
│  - Zustand (Estado)             │
│  - Axios (HTTP Client)          │
└──────────────┬──────────────────┘
               │ (API Calls)
               ↓
    ┌──────────────────────┐
    │ Backend (Port 3400)  │
    │ - Express.js         │
    │ - JWT Authentication │
    │ - Rate Limiting      │
    └──────────┬───────────┘
               │ (Queries)
               ↓
    ┌──────────────────────┐
    │  PostgreSQL Database │
    │  - Prisma ORM        │
    │  - Schema defined    │
    └──────────────────────┘
```

---

## 🧪 Testing y Quality

### Backend
```bash
cd Backend

# Linter de TypeScript
npx tsc --noEmit

# Ejecutar tests (si existen)
npm test
```

### Frontend
```bash
cd Frontend

# ESLint
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit

# Build test
npm run build
```

---

## 📊 Base de Datos

### Modelo Entidad-Relación

```
usuarios (n) ──── (1) roles
   │               │
   ├─── (1) ────── permisos
   │
   ├─── (n) productos
   │
   ├─── (n) ordenes
   │
   ├─── (n) modulonotificaciones
   │
   └─── (n) auditoria

productos (n) ──── (1) categoria
   │
   └─── (n) ordenes

ordenes (n) ──── (1) usuarios (comprador)
```

### Tablas Principales

| Tabla | Descripción | Registros Iniciales |
|-------|-------------|-------------------|
| `usuarios` | Usuarios del sistema | 3 (admin, seller, buyer) |
| `roles` | Roles de usuarios | 3 (admin, seller, buyer) |
| `productos` | Catálogo de productos | 0 (agregar manualmente) |
| `ordenes` | Órdenes de compra | 0 |
| `categoria` | Categorías | 9 |
| `modulonotificaciones` | Notificaciones | 10 (ejemplos) |

---

## 🚀 Deployment

### Deployment del Backend (Recomendado: Heroku, Railway, Render)

```bash
# Build
npm run build

# Start
npm start
```

### Deployment del Frontend (Recomendado: Vercel, Netlify, GitHub Pages)

```bash
# Build
npm run build

# Deploy usando Vercel CLI
npm i -g vercel
vercel
```

---

## 📝 Convenciones de Código

### Estructura de Carpetas
- **Componentes**: `CamelCase.tsx`
- **Páginas**: `CamelCase.tsx`
- **Servicios**: `camelCase.ts`
- **Tipos**: `CamelCase.ts`
- **Stores**: `camelCaseStore.ts`

### Commits con Git
```bash
# Feature
git commit -m "feat: Agregar funcionalidad X"

# Bug fix
git commit -m "fix: Corregir error en X"

# Documentación
git commit -m "docs: Actualizar README"

# Refactoring
git commit -m "refactor: Mejorar estructura de X"
```

---

## 🤝 Contribuir

1. Crea una rama: `git checkout -b feature/mi-feature`
2. Realiza cambios y commit: `git commit -am 'feat: Agregar mi feature'`
3. Push a la rama: `git push origin feature/mi-feature`
4. Abre un Pull Request

---

## 🆘 Soporte y Troubleshooting

### Problemas Comunes

| Problema | Solución |
|----------|----------|
| Port 3400/5173 en uso | Ver [Deploy.md - Solución de Problemas](./Deploy.md#solución-de-problemas) |
| Error de conexión a BD | Verificar `.env` y que PostgreSQL esté corriendo |
| CORS error | Verificar que backend tiene CORS habilitado |
| Tipos de TypeScript | Ejecutar `npx tsc --noEmit` para ver errores específicos |

**👉 Para guía completa de troubleshooting, ver [Deploy.md](./Deploy.md)**

---

## 📈 Roadmap Futuro

- [ ] Integración de pagos (Stripe, PayPal)
- [ ] Sistema de reviews y calificaciones
- [ ] Búsqueda avanzada con Elasticsearch
- [ ] Carga de archivos (imágenes de productos)
- [ ] Email automáticos
- [ ] Historial de cambios con auditoría detallada
- [ ] App móvil con React Native
- [ ] PWA (Progressive Web App)
- [ ] Caché con Redis
- [ ] Tests unitarios e integración

---

## 📞 Contacto

- **Proyecto**: E-commerce de Productos Tecnológicos
- **Grupo**: Rojo
- **Líder**: Edilson Luna (edilsonluna117@gmail.com)

---

## 📄 Licencia

ISC

---

## 📚 Referencias Útiles

- [Node.js Docs](https://nodejs.org/)
- [Express.js Docs](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)

---

**Última actualización**: Junio 2026  
**Status**: 🟢 En producción / 🟡 En desarrollo
