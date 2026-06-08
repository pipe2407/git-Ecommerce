# 🎨 Frontend - E-commerce UI

Interfaz de usuario moderna para el e-commerce de productos tecnológicos. Construida con **React 19**, **TypeScript**, **Vite** y **Tailwind CSS**.

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación Rápida](#instalación-rápida)
- [Variables de Entorno](#variables-de-entorno)
- [Comandos Disponibles](#comandos-disponibles)
- [Estructura de Componentes](#estructura-de-componentes)
- [Gestión de Estado](#gestión-de-estado)
- [Peticiones HTTP](#peticiones-http)
- [Rutas Disponibles](#rutas-disponibles)
- [Desarrollo](#desarrollo)
- [Build y Deploy](#build-y-deploy)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visión General

Este frontend proporciona una interfaz de usuario completa e intuitiva para el e-commerce. Incluye:

- ✅ **Autenticación de usuarios** con JWT tokens
- ✅ **Catálogo de productos** con búsqueda y filtros
- ✅ **Carrito de compras** persistente
- ✅ **Sistema de órdenes** de compra
- ✅ **Perfil de usuario** y gestión de cuenta
- ✅ **Dashboard admin** para gestión de productos
- ✅ **Respuestas rápidas** con Vite
- ✅ **Estilos modernos** con Tailwind CSS
- ✅ **Type-safe** con TypeScript

---

## 🛠️ Tecnologías

### Stack Principal
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **React** | 19.2.4 | Biblioteca de UI |
| **TypeScript** | 6.0.2 | Tipado estático |
| **Vite** | 8.0.4 | Bundler y dev server |
| **React Router** | 7.14.0 | Enrutamiento en cliente |
| **Zustand** | 5.0.12 | Gestión de estado |
| **Tailwind CSS** | 4.2.2 | Framework CSS |
| **Axios** | 1.15.0 | Cliente HTTP |

### Herramientas de Desarrollo
| Herramienta | Descripción |
|------------|-------------|
| **ESLint** | Linter de código |
| **TypeScript ESLint** | Validación de TypeScript |
| **Tailwind Vite Plugin** | Integración Tailwind con Vite |

---

## 📁 Estructura del Proyecto

```
Frontend/
├── src/
│   ├── App.tsx                 # Componente raíz
│   ├── main.tsx                # Punto de entrada
│   ├── components/             # Componentes reutilizables
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   └── ProductDetail.tsx
│   │   ├── cart/
│   │   │   ├── Cart.tsx
│   │   │   └── CartItem.tsx
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── common/
│   │       ├── Loading.tsx
│   │       ├── Error.tsx
│   │       └── Button.tsx
│   ├── pages/                  # Páginas/vistas
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── NotFound.tsx
│   ├── store/                  # Gestión de estado (Zustand)
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   ├── productStore.ts
│   │   └── notificationStore.ts
│   ├── services/               # Servicios HTTP
│   │   ├── api.ts              # Configuración de Axios
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   └── notificationService.ts
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useNotification.ts
│   ├── types/                  # Interfaces y tipos
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── Notification.ts
│   ├── utils/                  # Utilidades
│   │   ├── localStorage.ts
│   │   ├── validation.ts
│   │   └── formatting.ts
│   ├── styles/                 # Estilos globales
│   │   └── globals.css
│   └── config/                 # Configuración
│       └── constants.ts
│
├── public/                     # Assets estáticos
│   └── index.html
├── node_modules/
├── package.json
├── package-lock.json
├── vite.config.ts              # Configuración de Vite
├── tailwind.config.js          # Configuración de Tailwind
├── tsconfig.json               # Configuración de TypeScript
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js            # Configuración de ESLint
├── .env                        # Variables de entorno
├── .gitignore
└── README.md                   # Este archivo
```

---

## 📦 Instalación Rápida

### Prerrequisitos
- **Node.js** v16 o superior
- **npm** v7 o superior
- **Backend corriendo** en `http://localhost:3400`

### Pasos de Instalación

1. **Instalar dependencias**
```bash
cd Frontend
npm install
```

2. **Crear/Verificar archivo `.env`**
```bash
# El archivo ya existe. Verifica que contenga:
VITE_API_URL=http://localhost:3400/api
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev

# Output esperado:
# VITE v8.0.4  ready in XXX ms
# ➜  Local:   http://localhost:5173/
# ➜  Press h to show help
```

4. **Acceder a la aplicación**
```
http://localhost:5173
```

**Para guía de instalación completa, ver [Deploy.md](../Deploy.md)**

---

## 🔐 Variables de Entorno

Crea o verifica el archivo `.env` en la raíz de Frontend/:

```env
# URL del API backend (incluye /api)
# Cambiar el puerto si el backend está en otro puerto
VITE_API_URL=http://localhost:3400/api
```

### Variables disponibles:
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del API backend | `http://localhost:3400/api` |

**Nota**: Las variables deben empezar con `VITE_` para ser accesibles en el código.

---

## ⚙️ Comandos Disponibles

### Desarrollo
```bash
# Iniciar servidor de desarrollo (hot-reload)
npm run dev

# Accede a: http://localhost:5173
```

### Build
```bash
# Compilar TypeScript y crear bundle de producción
npm run build

# Esto genera la carpeta 'dist/' con los archivos optimizados
```

### Preview
```bash
# Previsualizar el build de producción localmente
npm run preview

# Accede a: http://localhost:4173
```

### Linting
```bash
# Ejecutar ESLint (verificar código)
npm run lint

# Mostrar errores y advertencias
```

### Verificación de Tipos
```bash
# Verificar errores de tipos TypeScript sin compilar
npx tsc --noEmit
```

---

## 🏗️ Estructura de Componentes

### Componentes Principales

#### Layout
- **Header.tsx** - Encabezado con logo y navegación
- **Navbar.tsx** - Barra de navegación con enlaces
- **Footer.tsx** - Pie de página

#### Productos
- **ProductCard.tsx** - Tarjeta individual de producto
- **ProductList.tsx** - Lista de productos
- **ProductDetail.tsx** - Detalle de un producto

#### Carrito
- **Cart.tsx** - Vista del carrito
- **CartItem.tsx** - Item dentro del carrito

#### Autenticación
- **Login.tsx** - Formulario de login
- **Register.tsx** - Formulario de registro
- **ProtectedRoute.tsx** - Ruta protegida para usuarios autenticados

### Ejemplo de uso:
```tsx
// pages/Home.tsx
import ProductList from '../components/products/ProductList';
import Header from '../components/layout/Header';

export default function Home() {
  return (
    <>
      <Header />
      <ProductList />
    </>
  );
}
```

---

## 📦 Gestión de Estado

Usamos **Zustand** para gestionar el estado global de la aplicación.

### Stores disponibles

#### authStore.ts
```typescript
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: (email, password) => { ... },
  logout: () => { ... },
  setUser: (user) => { ... }
}));

// Uso en componentes:
const { user, token, login } = useAuthStore();
```

#### cartStore.ts
```typescript
const useCartStore = create((set) => ({
  items: [],
  total: 0,
  addItem: (product) => { ... },
  removeItem: (id) => { ... },
  clearCart: () => { ... }
}));

// Uso en componentes:
const { items, addItem, removeItem } = useCartStore();
```

#### productStore.ts
```typescript
const useProductStore = create((set) => ({
  products: [],
  loading: false,
  fetchProducts: () => { ... },
  setProducts: (products) => { ... }
}));

// Uso en componentes:
const { products, loading, fetchProducts } = useProductStore();
```

---

## 🌐 Peticiones HTTP

### Configuración de Axios

El archivo `services/api.ts` configura Axios con:
- URL base desde `.env`
- Interceptores para JWT tokens
- Manejo de errores centralizado

```typescript
// services/api.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para agregar token a cada petición
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Servicios HTTP

#### authService.ts
```typescript
export const authService = {
  login: (email: string, password: string) => 
    api.post('/usuarios/login', { email, password }),
  
  register: (userData: UserRegister) => 
    api.post('/usuarios/crear', userData),
  
  getUser: (id: number) => 
    api.get(`/usuarios/consultar?id=${id}`)
};
```

#### productService.ts
```typescript
export const productService = {
  getAllProducts: (category?: string) => 
    api.get('/productos', { params: { category } }),
  
  getProductById: (id: number) => 
    api.get(`/productos/${id}`),
  
  searchProducts: (query: string) => 
    api.get('/productos/search', { params: { q: query } })
};
```

#### orderService.ts
```typescript
export const orderService = {
  createOrder: (orderData: Order) => 
    api.post('/ordenes', orderData),
  
  getUserOrders: () => 
    api.get('/ordenes/mis-ordenes'),
  
  getOrderById: (id: number) => 
    api.get(`/ordenes/${id}`)
};
```

---

## 🛣️ Rutas Disponibles

Configuradas en el componente principal con React Router v7:

```typescript
// App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/productos" element={<Products />} />
    <Route path="/productos/:id" element={<ProductDetail />} />
    <Route path="/carrito" element={<Cart />} />
    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
    <Route path="/login" element={<Login />} />
    <Route path="/registro" element={<Register />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Rutas públicas
- `/` - Página de inicio
- `/productos` - Catálogo de productos
- `/productos/:id` - Detalle de producto
- `/carrito` - Carrito de compras
- `/login` - Login
- `/registro` - Registro

### Rutas protegidas (requieren autenticación)
- `/checkout` - Proceso de compra
- `/dashboard` - Dashboard del usuario

### Rutas admin (requieren rol admin)
- `/admin/productos` - Gestión de productos
- `/admin/órdenes` - Gestión de órdenes

---

## 💻 Desarrollo

### Crear un nuevo componente

```typescript
// components/products/ProductCard.tsx
import { Product } from '../../types/Product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <img src={product.imagen} alt={product.nombre} className="w-full h-48 object-cover" />
      <h3 className="mt-2 font-bold">{product.nombre}</h3>
      <p className="text-gray-600">${product.precio}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Agregar al carrito
      </button>
    </div>
  );
}
```

### Usar un hook personalizado

```typescript
// hooks/useAuth.ts
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, login, logout } = useAuthStore();
  
  return {
    isAuthenticated: !!token,
    user,
    login,
    logout
  };
};

// Uso en componente:
function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  
  return (
    <header>
      {isAuthenticated ? (
        <>
          <span>Bienvenido, {user?.nombre}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </header>
  );
}
```

### Estilos con Tailwind CSS

```typescript
// Clases Tailwind directamente en el JSX
<div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
  <h2 className="text-xl font-bold text-gray-800">Título</h2>
  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
    Acción
  </button>
</div>
```

---

## 🏗️ Build y Deploy

### Crear build de producción

```bash
npm run build

# Genera la carpeta 'dist/' optimizada para producción
```

### Previsualizar build

```bash
npm run preview

# Accede a: http://localhost:4173
```

### Opciones de deployment

#### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Se configurará automáticamente
```

#### Netlify
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Desplegar
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar a package.json:
"deploy": "npm run build && gh-pages -d dist"

# Desplegar
npm run deploy
```

---

## 🆘 Troubleshooting

### Error: "Cannot find module VITE_API_URL"
**Solución**: Verifica que el archivo `.env` existe y contiene:
```env
VITE_API_URL=http://localhost:3400/api
```

### Error: "Port 5173 is already in use"
```bash
# El puerto ya está en uso
# Opción 1: Cambiar puerto en vite.config.ts
# Opción 2: Matar el proceso

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :5173
kill -9 <PID>
```

### Error: "CORS error" en peticiones al backend
**Verifica:**
1. El backend está corriendo en `http://localhost:3400`
2. El backend tiene CORS habilitado
3. La URL en `.env` es correcta

```bash
# En Backend/src/server.ts:
import cors from 'cors';
app.use(cors());
```

### Error: "Cannot GET /"
**Solución**: Verifica que estás usando React Router y que la ruta "/" está definida.

### Error de TypeScript: "Type is not assignable"
```bash
# Verificar tipos sin compilar
npx tsc --noEmit

# Ver errores específicos de tipo
```

### El sitio se ve diferente en producción
**Causa**: Falta compilar Tailwind CSS  
**Solución**:
```bash
npm run build

# Verifica que tailwind.config.js está configurado correctamente
```

---

## 📚 Recursos Adicionales

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Axios Documentation](https://axios-http.com/)
- [Deploy.md](../Deploy.md) - Guía de instalación y despliegue completa

---

## 👨‍💻 Autor

**Grupo Rojo** - E-commerce de Productos Tecnológicos

---

## 📝 Licencia

ISC

---

**Última actualización**: Junio 2026
