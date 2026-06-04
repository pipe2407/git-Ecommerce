# 📋 PLAN DETALLADO DE EJECUCIÓN - SISTEMA DE NOTIFICACIONES

**Fecha:** 03/06/2026  
**Enfoque:** REVERSE (Frontend → Backend)  
**Nivel de Precisión:** Opus 4.7 Effort Max  
**Complejidad:** Básica, Funcional

---

## 🔍 FASE 1: ANÁLISIS ACTUAL DEL FRONTEND

### Estado Actual
- **Tipo de Proyecto:** E-commerce de productos
- **Páginas Existentes:**
  - LoginPage (login local)
  - RegisterPage (registro local)
  - CatalogPage (lista de productos desde MOCK_PRODUCTS)
  - ProductDetailPage (detalle de producto)
  - CartPage (carrito en memoria)
  - CheckoutPage (checkout sin backend)
  - HistoryPage (órdenes mock)
  - PublishPage (publicar productos)
  - ManagementPage (gestionar productos)
  - ReportsPage (reportes)
  - UserManagementPage (gestión usuarios)
  - HomePage (landing page)

### Mock Data Actual
```typescript
MOCK_PRODUCTS: Producto[] // 15+ productos quemados
MOCK_CATEGORIES: string[] // 6 categorías
// Datos en memoria, sin persistencia
```

### Estado de APIs
- ❌ No hay servicios HTTP reales
- ❌ Todo es en memoria (localStorage)
- ❌ Sin backend
- ❌ Sin base de datos

---

## 🎯 FASE 2: ANÁLISIS SCHEMA PRISMA (Parseado desde Mermaid)

### Tablas Principales Identificadas

**Autenticación & Roles:**
- `rol` - roles de usuario (admin, operario, etc.)
- `permisosgenericos` - permisos del sistema
- `genericosvssubmodulos` - asignación permisos-submodulos

**Notificaciones (CORE):**
- `modulonotificaciones` - notificaciones principales
- `tiponotificaciones` - tipo de notificación
- `estadonotificacion` - estado (pendiente, enviado, leído, etc.)
- `hiloRespuestaNotificacion` - respuestas/comentarios en notificaciones

**Datos Maestros:**
- `categoria` - categorías de notificaciones
- `campania` - campañas
- `radicados` - números de radicado
- `tipoRequerimiento` - tipos de requerimiento

**Configuración:**
- `formatos` - formatos de notificación
- `recordatorios` - configuración de recordatorios
- `modulosmaestros` - módulos del sistema
- `submodulos` - submodulos
- `maestrosvssubmodulos` - relación modulo-submodulo

**Blockchain & Auditoría:**
- `blockchain` - registros blockchain
- `auditoria` - auditoría de acciones
- `anio_actual` - año actual del sistema

**Otros:**
- `destinatario` - destinatarios
- `notificacionesvsdestinatario` - rel notificaciones-destinatarios
- `notificacionview` - vista de notificaciones
- `modulovssubmoduloview` - vista módulos-submodulos

### Estrategia de Simplificación
Como el proyecto debe ser **básico y funcional**, vamos a:
- ✅ Mantener tablas CORE (notificaciones, usuarios, roles)
- ✅ Incluir relaciones principales
- ✅ Eliminar tablas complejas innecesarias (blockchain, vistas, migraciones)
- ✅ Simplificar campos: solo lo esencial

---

## 📡 FASE 3: MAPEO REVERSE - APIS ESPERADAS DEL FRONTEND

### 1. AUTENTICACIÓN
**LoginPage espera:**
```
POST /auth/login
  Request: { email, password }
  Response: { token, usuario: { id, nombre, rol } }

POST /auth/register
  Request: { nombre, email, password, ... }
  Response: { id, email, nombre }

POST /auth/logout
  Response: { ok: true }
```

### 2. GESTIÓN DE NOTIFICACIONES (CatalogPage adaptada)
**Frontend espera lista de notificaciones:**
```
GET /notificaciones?filtros=...
  Response: [{
    id,
    asunto,
    estado,
    tipo,
    fecha,
    remitente,
    ...
  }]

GET /notificaciones/:id
  Response: { detalles completos + respuestas }

GET /tipos-notificaciones
  Response: [{ id, nombre, ... }]

GET /estados-notificacion
  Response: [{ id, nombre, ... }]

GET /categorias
  Response: [{ id, nombre, ... }]
```

### 3. ACCIONES EN NOTIFICACIONES (PublishPage adaptada)
```
POST /notificaciones
  Request: { asunto, descripcion, tipo, categoria, ... }
  Response: { id, ... }

PUT /notificaciones/:id
  Request: { estado, ... }
  Response: { ok: true }

DELETE /notificaciones/:id
  Response: { ok: true }
```

### 4. RESPUESTAS A NOTIFICACIONES (HistoryPage adaptada)
```
POST /notificaciones/:id/respuestas
  Request: { mensaje, adjunto }
  Response: { id, respuesta }

GET /notificaciones/:id/respuestas
  Response: [{ id, mensaje, de, para, fecha, ... }]
```

### 5. REPORTES Y ESTADÍSTICAS (ReportsPage)
```
GET /reportes/resumen
  Response: { 
    totalNotificaciones,
    pendientes,
    enviadas,
    ...
  }

GET /reportes/por-tipo
GET /reportes/por-estado
GET /reportes/por-usuario
```

### 6. CONFIGURACIÓN DE USUARIO (UserManagementPage)
```
GET /usuarios
GET /usuarios/:id
POST /usuarios
PUT /usuarios/:id
DELETE /usuarios/:id

GET /roles
GET /permisos
```

---

## 🗂️ FASE 4: SCHEMA PRISMA SIMPLIFICADO

### Modelo de Datos Básico Necesario

```prisma
// Usuarios y Roles
model usuario {
  id                  BigInt    @id @default(autoincrement())
  nombre              String    @db.VarChar(200)
  email               String    @unique @db.VarChar(200)
  password            String
  rol_id              BigInt
  estado              Boolean   @default(true)
  fechaCreacion       DateTime  @default(now())
  fechaModificacion   DateTime  @updatedAt
  
  rol                 rol       @relation(fields: [rol_id], references: [id])
  notificacionesEnviadas modulonotificaciones[] @relation("usuarioRemitente")
  respuestas          hiloRespuestaNotificacion[]
  auditoria           auditoria[]
}

model rol {
  id                  BigInt    @id @default(autoincrement())
  nombre              String    @unique @db.VarChar(100)
  descripcion         String?
  estado              Boolean   @default(true)
  fechaCreacion       DateTime  @default(now())
  fechaModificacion   DateTime  @updatedAt
  
  usuarios            usuario[]
  permisos            permiso[] @relation("rolPermisos")
}

model permiso {
  id                  BigInt    @id @default(autoincrement())
  nombre              String    @unique @db.VarChar(100)
  descripcion         String?
  fechaCreacion       DateTime  @default(now())
  fechaModificacion   DateTime  @updatedAt
  
  roles               rol[] @relation("rolPermisos")
}

// Notificaciones
model modulonotificaciones {
  id                  BigInt    @id @default(autoincrement())
  asunto              String    @db.VarChar(500)
  descripcion         String
  tipo_id             BigInt
  estado_id           BigInt
  categoria_id        BigInt
  usuario_id          BigInt
  plazo               String?   @db.VarChar(50)
  trimestre           Int?
  anioReporte         Int?
  entidad             String?   @db.VarChar(200)
  sector              String?   @db.VarChar(200)
  adjunto             String?
  textoNotificacion   String?
  fechaCreacion       DateTime  @default(now())
  fechaModificacion   DateTime  @updatedAt
  
  tipo                tiponotificaciones @relation(fields: [tipo_id], references: [id])
  estado              estadonotificacion @relation(fields: [estado_id], references: [id])
  categoria           categoria          @relation(fields: [categoria_id], references: [id])
  usuario             usuario            @relation("usuarioRemitente", fields: [usuario_id], references: [id])
  respuestas          hiloRespuestaNotificacion[]
  destinatarios       notificacionesvsdestinatario[]
}

model tiponotificaciones {
  id                  BigInt    @id @default(autoincrement())
  nombre              String    @unique @db.VarChar(100)
  descripcion         String?
  estado              Boolean   @default(true)
  fechaCreacion       DateTime  @default(now())
  fechaModificacion   DateTime  @updatedAt
  
  notificaciones      modulonotificaciones[]
}

model estadonotificacion {
  id                  BigInt    @id @default(autoincrement())
  nombre              String    @unique @db.VarChar(50)
  descripcion         String?
  estado              Boolean   @default(true)
  fechaCreacion       DateTime  @default(now())
  fechaModificacion   DateTime  @updatedAt
  
  notificaciones      modulonotificaciones[]
}

model categoria {
  id                  BigInt    @id @default(autoincrement())
  nombre              String    @unique @db.VarChar(100)
  descripcion         String?
  estado              Boolean   @default(true)
  fechaCreacion       DateTime  @default(now())
  fechaModificacion   DateTime  @updatedAt
  
  notificaciones      modulonotificaciones[]
}

model hiloRespuestaNotificacion {
  id                  BigInt    @id @default(autoincrement())
  notificacion_id     BigInt
  usuario_id          BigInt
  mensaje             String
  adjunto             String?
  estado              Boolean   @default(true)
  fechaCreacion       DateTime  @default(now())
  fechaModificacion   DateTime  @updatedAt
  
  notificacion        modulonotificaciones @relation(fields: [notificacion_id], references: [id], onDelete: Cascade)
  usuario             usuario              @relation(fields: [usuario_id], references: [id])
}

model notificacionesvsdestinatario {
  id                  BigInt    @id @default(autoincrement())
  notificacion_id     BigInt
  usuario_id          BigInt
  leida               Boolean   @default(false)
  fechaLectura        DateTime?
  fechaCreacion       DateTime  @default(now())
  fechaModificacion   DateTime  @updatedAt
  
  notificacion        modulonotificaciones @relation(fields: [notificacion_id], references: [id], onDelete: Cascade)
  usuario             usuario              @relation(fields: [usuario_id], references: [id])
}

model auditoria {
  id                  BigInt    @id @default(autoincrement())
  usuario_id          BigInt
  accion              String    @db.VarChar(500)
  entidad             String    @db.VarChar(100)
  entidadId           BigInt
  detalles            String?
  fechaCreacion       DateTime  @default(now())
  
  usuario             usuario @relation(fields: [usuario_id], references: [id])
}
```

### Tablas Eliminadas (por simplicidad)
- ❌ blockchain - innecesario para MVP
- ❌ radicados - se puede simplificar
- ❌ formatos - se puede hacer hardcoded
- ❌ recordatorios - futura mejora
- ❌ modulosmaestros/submodulos - se puede usar simples enums
- ❌ Todas las VIEWS
- ❌ migrations

---

## 🏗️ FASE 5: ESTRUCTURA BACKEND

### Patrón Controller/Service/Repository

```
Backend/src/
├── modules/
│   ├── auth/
│   │   ├── controller/
│   │   │   └── auth.controller.ts
│   │   ├── service/
│   │   │   └── auth.service.ts
│   │   ├── repository/
│   │   │   └── auth.repository.ts
│   │   ├── models/
│   │   │   └── auth.model.ts
│   │   └── routes/
│   │       └── auth.routes.ts
│   │
│   ├── notificaciones/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── models/
│   │   └── routes/
│   │
│   ├── usuarios/
│   ├── roles/
│   ├── categorias/
│   ├── reportes/
│   │
├── middleware/
│   ├── autenticacion.ts
│   └── autorizacion.ts
│
├── utils/
│   ├── jwt.ts
│   └── errores.ts
│
└── app.ts
```

### Endpoints Básicos Necesarios

**Módulo Auth:**
- `POST /auth/login` - Autenticar usuario
- `POST /auth/register` - Registrar usuario
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refrescar token

**Módulo Notificaciones:**
- `GET /notificaciones` - Listar notificaciones
- `GET /notificaciones/:id` - Detalle
- `POST /notificaciones` - Crear
- `PUT /notificaciones/:id` - Actualizar
- `DELETE /notificaciones/:id` - Eliminar
- `POST /notificaciones/:id/respuestas` - Agregar respuesta
- `GET /notificaciones/:id/respuestas` - Listar respuestas

**Módulo Usuarios:**
- `GET /usuarios` - Listar
- `GET /usuarios/:id` - Detalle
- `POST /usuarios` - Crear
- `PUT /usuarios/:id` - Actualizar
- `DELETE /usuarios/:id` - Eliminar

**Módulo Roles:**
- `GET /roles` - Listar roles
- `GET /roles/:id` - Detalle

**Módulo Categorías:**
- `GET /categorias` - Listar
- `POST /categorias` - Crear

**Módulo Reportes:**
- `GET /reportes/resumen` - Resumen general
- `GET /reportes/por-tipo` - Estadísticas por tipo
- `GET /reportes/por-estado` - Estadísticas por estado

**Total: ~20 endpoints básicos**

---

## 🔗 FASE 6: VALIDACIÓN DE COHERENCIA

### Mapeo Frontend → Backend

| Página | Acción | API Esperada | Método |
|--------|--------|-------------|--------|
| LoginPage | Login | POST /auth/login | POST |
| RegisterPage | Registrar | POST /auth/register | POST |
| CatalogPage | Listar notificaciones | GET /notificaciones | GET |
| CatalogPage | Filtrar | GET /notificaciones?filtros | GET |
| ProductDetailPage (→ NotificacionDetail) | Ver detalle | GET /notificaciones/:id | GET |
| PublishPage | Crear notificación | POST /notificaciones | POST |
| ManagementPage | Listar mis notificaciones | GET /notificaciones?usuario_id | GET |
| ManagementPage | Actualizar estado | PUT /notificaciones/:id | PUT |
| ManagementPage | Eliminar | DELETE /notificaciones/:id | DELETE |
| HistoryPage | Respuestas | GET /notificaciones/:id/respuestas | GET |
| HistoryPage | Agregar respuesta | POST /notificaciones/:id/respuestas | POST |
| ReportsPage | Estadísticas | GET /reportes/* | GET |
| UserManagementPage | CRUD usuarios | GET/POST/PUT/DELETE /usuarios | CRUD |

✅ **Validación:** COHERENTE - Cada acción del frontend tiene su endpoint correspondiente

---

## 🛠️ FASE 7: CAMBIOS EN FRONTEND

### SIN Cambios Visuales
- ✅ Mantener todas las páginas igual
- ✅ Mantener el diseño idéntico
- ✅ Mantener la estructura de componentes

### SÍ Cambios en Lógica (Conexión a API)

**LoginPage:**
```
// Antes: localStorage simulado
// Después: POST /auth/login → obtener JWT → guardar en localStorage
```

**CatalogPage (renombrado a NotificacionesPage conceptualmente):**
```
// Antes: MOCK_PRODUCTS (arrays quemados)
// Después: GET /notificaciones → state management → renderizar
```

**PublishPage:**
```
// Antes: guardaba en memoria
// Después: POST /notificaciones → backend
```

**Otros:** Similar patrón para todas las páginas

---

## 📊 FASE 8: CAMBIOS EN BACKEND

### 1. Schema Prisma
- ✅ Crear nuevo `schema.prisma` con las tablas del modelo
- ✅ Generar migraciones
- ✅ Generar cliente Prisma

### 2. Modelos & Tipos
- ✅ Crear interfaces TypeScript
- ✅ Definir request/response types

### 3. Controladores
- ✅ 6 módulos (auth, notificaciones, usuarios, roles, categorias, reportes)
- ✅ ~20 endpoints

### 4. Servicios
- ✅ Lógica de negocio
- ✅ Validaciones
- ✅ Transformación de datos

### 5. Repositorios
- ✅ Operaciones Prisma
- ✅ Queries a BD

### 6. Middlewares
- ✅ JWT authentication
- ✅ Error handling

### 7. Routes
- ✅ Registrar todos los endpoints

### 8. Seed/Datos Iniciales
- ✅ Roles: admin, operario, ciudadano
- ✅ Usuarios de prueba
- ✅ Categorías, tipos de notificación, estados
- ✅ Datos de ejemplo

---

## 🎯 FASE 9: EJECUCIÓN PARALELA (2 AGENTES OPUS 4.7)

### Agente 1: Backend
- Crear schema.prisma simplificado
- Crear 6 módulos con C/S/R
- Crear middlewares
- Crear rutas
- Generar seed
- Validar sin errores TypeScript

### Agente 2: Frontend
- Crear servicios HTTP reales
- Crear stores/state management
- Conectar componentes a APIs
- Eliminar MOCK_DATA
- Validar sin errores TypeScript

**Ejecución:** Ambos en paralelo → Luego integración

---

## ✅ FASE 10: VALIDACIONES FINALES

- [ ] Frontend compila sin errores
- [ ] Backend compila sin errores
- [ ] Schema Prisma es válido
- [ ] Endpoints responden correctamente
- [ ] JWT authentication funciona
- [ ] Seed carga datos correctamente
- [ ] Formularios envían datos correctamente

---

## 📋 RESUMEN EJECUTIVO

| Aspecto | Detalles |
|--------|----------|
| **Base de Datos** | 8-10 tablas (simplificadas) |
| **Endpoints** | ~20 básicos y funcionales |
| **Módulos Backend** | 6 (auth, notif, usuarios, roles, categorias, reportes) |
| **Cambios Frontend** | Solo lógica, SIN diseño |
| **Complejidad** | BAJA (MVP funcional) |
| **Precisión** | ALTA (Opus 4.7 effort max) |
| **Tiempo Est.** | 2-3 horas ejecución en paralelo |

---

## 🚀 SIGUIENTE PASO

**Esperar aprobación del usuario antes de ejecutar.**

Cuando se apruebe:
1. Ejecutar Agente Backend (crear todo backend)
2. Ejecutar Agente Frontend (conectar a APIs)
3. Integrar cambios
4. Validar funcionamiento
5. Ajustar si hay errores

---

**Este plan es DETALLADO, PRECISO y está LISTO para EJECUTAR.**

