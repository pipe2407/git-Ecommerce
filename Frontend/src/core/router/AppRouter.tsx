// Router principal — conecta todos los módulos del backlog EC-001 → EC-010
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Home
import HomePage from '../../pages/HomePage';

// Auth
import LoginPage          from '../../modules/auth/pages/LoginPage';
import RegisterPage       from '../../modules/auth/pages/RegisterPage';
import ForgotPasswordPage from '../../modules/auth/pages/ForgotPasswordPage';

// Catalog
import CatalogPage       from '../../modules/catalog/pages/CatalogPage';
import ProductDetailPage from '../../modules/catalog/pages/ProductDetailPage';
import CartPage          from '../../modules/catalog/pages/CartPage';

// Checkout
import CheckoutPage from '../../modules/checkout/pages/CheckoutPage';

// Account
import HistoryPage from '../../modules/account/pages/HistoryPage';

// Publisher (Vendedor)
import PublishPage    from '../../modules/publisher/pages/PublishPage';
import ManagementPage from '../../modules/publisher/pages/ManagementPage';

// Admin
import ReportsPage from '../../modules/admin/pages/ReportsPage';
import UserManagementPage from '../../modules/admin/pages/UserManagementPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home / Landing */}
        <Route path="/" element={<HomePage />} />

        {/* ─ Auth ─────────────────────────────── */}
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* ─ Catálogo ─────────────────────────── */}
        <Route path="/catalog"       element={<CatalogPage />} />
        <Route path="/product/:id"   element={<ProductDetailPage />} />
        <Route path="/cart"          element={<CartPage />} />

        {/* ─ Checkout ─────────────────────────── */}
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* ─ Cuenta ───────────────────────────── */}
        <Route path="/orders" element={
          <PrivateRoute requiredRoles={['seller', 'buyer']}>
            <HistoryPage />
          </PrivateRoute>
        } />

        {/* ─ Vendedor ─────────────────────────── */}
        <Route path="/publish" element={
          <PrivateRoute requiredRoles={['seller']}>
            <PublishPage />
          </PrivateRoute>
        } />
        <Route path="/management" element={
          <PrivateRoute requiredRoles={['seller']}>
            <ManagementPage />
          </PrivateRoute>
        } />

        {/* ─ Admin ────────────────────────────── */}
        <Route path="/admin/reports" element={
          <PrivateRoute requiredRoles={['admin']}>
            <ReportsPage />
          </PrivateRoute>
        } />
        <Route path="/admin/users" element={
          <PrivateRoute requiredRoles={['admin']}>
            <UserManagementPage />
          </PrivateRoute>
        } />

        {/* 404 fallback */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <div className="text-8xl mb-6">🚀</div>
            <h1 className="text-5xl font-extrabold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              404
            </h1>
            <p className="text-xl text-slate-400 mb-8">Esta página no existe o fue movida.</p>
            <a href="/" className="btn-primary px-8 py-3.5">Ir al inicio</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
