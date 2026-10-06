import { lazy, Suspense } from 'react'
import { ConfigProvider, App as AntApp } from 'antd'
import azAZ from 'antd/locale/az_AZ'
import enUS from 'antd/locale/en_US'
import ruRU from 'antd/locale/ru_RU'
import { Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PublicLayout from './layouts/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { Loading } from './components/PageState'

import MenuPage from './pages/public/MenuPage'
import CategoryPage from './pages/public/CategoryPage'
import NotFound from './pages/NotFound'

// Admin hissəsi ayrı chunk-lardadır: müştəri menyunu açanda admin kodu (Table, Form, Upload) yüklənmir.
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const LoginPage = lazy(() => import('./pages/admin/LoginPage'))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const CategoriesPage = lazy(() => import('./pages/admin/CategoriesPage'))
const ItemsPage = lazy(() => import('./pages/admin/ItemsPage'))

const ANTD_LOCALES = { az: azAZ, en: enUS, ru: ruRU }

const THEME = {
  token: {
    colorPrimary: '#c0392b',
    borderRadius: 8,
  },
}

export default function App() {
  const { i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage || 'az').slice(0, 2)

  return (
    <ConfigProvider locale={ANTD_LOCALES[lang] || azAZ} theme={THEME}>
      <AntApp>
        {/* Lazy admin chunk-ı yüklənənə qədər */}
        <Suspense fallback={<Loading fullscreen />}>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route index element={<MenuPage />} />
              <Route path="menu/:slug" element={<CategoryPage />} />
            </Route>

            {/* Admin: login AdminLayout-suz */}
            <Route path="admin/login" element={<LoginPage />} />

            {/* Admin: qorunan hissə */}
            <Route path="admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="items" element={<ItemsPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route element={<PublicLayout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </AntApp>
    </ConfigProvider>
  )
}
