# 🚀 GUÍA DE EJECUCIÓN RÁPIDA

## 1️⃣ Preparar Base de Datos

```bash
cd Backend

# Generar cliente Prisma
npm run prisma:generate

# Crear tablas en BD
npm run prisma:migrate

# Cargar datos iniciales (seed)
npm run prisma:seed
```

**Resultado esperado:**
```
Seed completado: 3 usuarios, 5 categorías, etc.
```

---

## 2️⃣ Ejecutar Backend

```bash
cd Backend
npm run dev
```

**Resultado esperado:**
```
Api escuchando en el puerto: 3400
```

**Si falla:** 
- Verificar que PostgreSQL está ejecutándose
- Verificar que la BD está creada
- Verificar que el archivo `.env` tiene `DATABASE_URL` correcto

---

## 3️⃣ Ejecutar Frontend (otra terminal)

```bash
cd Frontend
npm run dev
```

**Resultado esperado:**
```
Local: http://localhost:5173
```

---

## 4️⃣ Payloads Correctos para APIs

### ✅ POST /api/auth/register

**Payload CORRECTO:**
```json
{
    "nombre": "Edilson Luna",
    "email": "edilsonluna117@gmail.com",
    "password": "TKSCZfUBUPa5DDP",
    "rol_id": 3
}
```

**Respuesta:**
```json
{
    "id": "1",
    "email": "edilsonluna117@gmail.com",
    "nombre": "Edilson Luna"
}
```

**Roles disponibles:**
- `1` = admin
- `2` = operario
- `3` = ciudadano

---

### ✅ POST /api/auth/login

**Payload:**
```json
{
    "email": "edilsonluna117@gmail.com",
    "password": "TKSCZfUBUPa5DDP"
}
```

**Respuesta:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
        "id": "1",
        "email": "edilsonluna117@gmail.com",
        "nombre": "Edilson Luna",
        "rol": "ciudadano"
    }
}
```

**Cookie (automática):**
```
refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (HttpOnly)
```

---

### ✅ Usar el Token en Requests

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 5️⃣ Usuarios de Prueba (desde seed)

| Email | Password | Rol |
|-------|----------|-----|
| admin@test.com | 123456 | admin |
| operario@test.com | 123456 | operario |
| ciudadano@test.com | 123456 | ciudadano |

---

## 6️⃣ Endpoints Disponibles

### Auth
```
POST   /api/auth/register    - Crear usuario
POST   /api/auth/login       - Autenticar
POST   /api/auth/logout      - Logout
POST   /api/auth/refresh     - Refrescar token
```

### Notificaciones
```
GET    /api/notificaciones           - Listar
GET    /api/notificaciones/:id       - Detalle
POST   /api/notificaciones           - Crear (requiere auth)
PUT    /api/notificaciones/:id       - Actualizar (requiere auth)
DELETE /api/notificaciones/:id       - Eliminar (requiere auth)
POST   /api/notificaciones/:id/respuestas - Agregar respuesta (requiere auth)
GET    /api/notificaciones/:id/respuestas - Listar respuestas
```

### Usuarios
```
GET    /api/usuarios         - Listar (requiere auth admin)
GET    /api/usuarios/:id     - Detalle
POST   /api/usuarios         - Crear (requiere auth admin)
PUT    /api/usuarios/:id     - Actualizar
DELETE /api/usuarios/:id     - Eliminar (requiere auth admin)
```

### Roles
```
GET    /api/roles            - Listar roles
```

### Categorías
```
GET    /api/categorias       - Listar
POST   /api/categorias       - Crear (requiere auth admin)
```

### Reportes
```
GET    /api/reportes/resumen       - Totales
GET    /api/reportes/por-tipo      - Por tipo de notificación
GET    /api/reportes/por-estado    - Por estado
```

---

## ⚠️ Problemas Comunes

### Error 404 en /api/auth/register
**Causa:** Backend no está ejecutándose  
**Solución:** Ejecutar `npm run dev` en carpeta Backend

### Error "El email ya está registrado"
**Causa:** El email ya existe en BD  
**Solución:** Usar otro email o ejecutar `npm run prisma:seed` de nuevo

### Error "El rol indicado no existe"
**Causa:** Enviaste `rol_id` con valor incorrecto  
**Solución:** Usar 1, 2 o 3 (ver tabla arriba)

### Error 401 Unauthorized
**Causa:** Token no es válido o no está en header  
**Solución:** Enviar `Authorization: Bearer {token}` en headers

### Error 403 Forbidden
**Causa:** Usuario no tiene permiso (ej. admin requerido)  
**Solución:** Usar usuario con rol correcto

---

## 🧪 Test Completo (CLI)

```bash
# 1. Registrar usuario
curl -X POST http://localhost:3400/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "rol_id": 3
  }'

# 2. Login
curl -X POST http://localhost:3400/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 3. Listar notificaciones (con token)
curl -X GET http://localhost:3400/api/notificaciones \
  -H "Authorization: Bearer <TOKEN_AQUI>"

# 4. Crear notificación
curl -X POST http://localhost:3400/api/notificaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_AQUI>" \
  -d '{
    "asunto": "Mi notificación",
    "descripcion": "Descripción detallada",
    "tipo_id": 1,
    "estado_id": 1,
    "categoria_id": 1
  }'
```

---

## ✅ Checklist de Validación

- [ ] Backend: npm run prisma:generate ✓
- [ ] Backend: npm run prisma:migrate ✓
- [ ] Backend: npm run prisma:seed ✓
- [ ] Backend: npm run dev (escucha en 3400) ✓
- [ ] Frontend: npm run dev (escucha en 5173) ✓
- [ ] POST /auth/register funciona ✓
- [ ] POST /auth/login funciona ✓
- [ ] GET /notificaciones funciona ✓
- [ ] GET /api/roles retorna 3 roles ✓

---

**¡Todo listo! El sistema está operativo.** 🎉

