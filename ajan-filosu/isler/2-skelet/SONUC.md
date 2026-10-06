# SONUC · 2-skelet · Dalğa 1

- Başlama: 2026-09-27 20:37
- Bitmə: 2026-09-27 20:45
- Status: **bitdi** (build keçir, dev serverdə marşrutlar 200 qaytarır)

## Quraşdırılan paketlər (faktiki versiyalar)

| Paket | Versiya |
|---|---|
| react / react-dom | 19.3.0 |
| antd | 6.6.5 |
| @ant-design/icons | 6.3.4 |
| react-router-dom | 7.18.4 |
| axios | 1.20.0 |
| i18next | 26.4.2 |
| react-i18next | 17.0.15 |
| i18next-browser-languagedetector | 8.2.1 |
| vite (dev) | 8.3.1 |
| @vitejs/plugin-react (dev) | 6.1.1 |
| oxlint (dev, Vite şablonundan) | 1.81.0 |

**React/antd uyğunluğu:** antd v6 (peerDependencies `react >=18`) React 19-u rəsmi dəstəkləyir, ona görə `@ant-design/v5-patch-for-react-19` patch-ı lazım deyil və quraşdırılmayıb. `npm ls` bütün antd alt-paketlərinin eyni react@19.3.0 istifadə etdiyini göstərir. antd locale faylları `az_AZ`, `en_US`, `ru_RU` mövcuddur.

Qeyd (Dalğa 2 üçün): antd v6-da bəzi v5 prop-ları köhnəlib, məs. `Spin tip` yerinə `description`. Deprecated prop-lar konsolda xəbərdarlıq verir.

## Yaradılan fayllar (`menu-app/client/`)

- `package.json`, `package-lock.json`, `index.html` (lang="az", başlıq "Menyu"), `.gitignore` (node_modules, dist Vite şablonundan), `.oxlintrc.json`, `public/favicon.svg`
- `vite.config.js`: port 5173, proxy `/api` və `/uploads` -> `http://localhost:5000`, `chunkSizeWarningLimit: 1500`
- `src/main.jsx`: `./i18n` import, `BrowserRouter` > `AuthProvider` > `App`
- `src/App.jsx`: `ConfigProvider` (locale dilə görə az_AZ/en_US/ru_RU, tema: `colorPrimary #c0392b`, `borderRadius 8`), antd `<App>` (message/modal/notification kontekst üçün), bütün marşrutlar
- `src/index.css`: minimal reset
- `src/i18n/index.js`: az default + fallback, en, ru; namespace-lər common (default, fallbackNS), public, admin; detektor sırası localStorage > navigator, açar `menu_lang`; `<html lang>` dillə yenilənir. Əlavə exportlar: `LANGUAGES`, `DEFAULT_LANGUAGE`, `LANG_STORAGE_KEY`, `currentLang()`
- `src/i18n/locales/{az,en,ru}/common.json`: real tərcümələr (siteName, languages, loading, error, errorDescription, networkError, retry, back, backHome, notFound, notFoundDescription, empty, comingSoon, save, cancel, delete, edit, add, search, yes, no, confirm, close, actions, sessionExpired, footer, nav.{menu, admin, dashboard, categories, items, login, logout})
- `src/i18n/locales/{az,en,ru}/public.json` və `admin.json`: yalnız `{}`
- `src/api/client.js`: axios instansı (`baseURL '/api'`), Bearer token interceptor, 401-də token silinir və `window`-a `auth:logout` hadisəsi göndərilir. Əlavə exportlar: `TOKEN_KEY`, `LOGOUT_EVENT`, `getToken`, `setToken`, `getErrorMessage(error, fallback)`, `getErrorFields(error)`
- `src/context/AuthContext.jsx`: `AuthProvider`, `useAuth()` -> `{ token, admin, isAuthenticated, checking, login(email,password), logout() }`, token localStorage `menu_token`; səhifə yenilənəndə `GET /api/auth/me` ilə admin bərpa olunur
- `src/components/ProtectedRoute.jsx`: giriş yoxdursa `/admin/login`-ə (`state.from` ilə) yönləndirir; `children` yoxdursa `<Outlet/>`
- `src/components/LangSwitcher.jsx`: antd `Segmented` (default, AZ/EN/RU) və ya `variant="select"` (tam adlarla)
- `src/components/PageState.jsx`: `Loading` (`fullscreen` prop), `ErrorState`/`Error` (`onRetry` ilə "Yenidən cəhd et"), `EmptyState`/`Empty`; default export `{Loading, Error, Empty}`
- `src/layouts/PublicLayout.jsx`: sticky başlıq (sayt adı linki + LangSwitcher), `<Outlet/>` (max 1200px), footer
- `src/layouts/AdminLayout.jsx`: antd Layout + Sider menyu (Dashboard, Bölmələr, Məhsullar, Çıxış), `lg` altında yığılır (mobildə overlay kimi açılır, `collapsedWidth 0`), başlıqda toggle düyməsi, admin email, LangSwitcher
- `src/utils/localize.js`: `localize(obj, lang)` -> `obj[lang] || obj.az || ''` (string gəlsə olduğu kimi, `en-US` kimi dil kodunu 2 hərfə qısaldır)
- `src/utils/format.js`: `formatPrice(n)` -> `"12.50 ₼"`
- Stub səhifələr (başlıq + "Hazırlanır", default export): `pages/public/MenuPage.jsx` (/), `pages/public/CategoryPage.jsx` (/menu/:slug), `pages/admin/LoginPage.jsx` (/admin/login, AdminLayout-suz), `pages/admin/DashboardPage.jsx` (/admin), `pages/admin/CategoriesPage.jsx` (/admin/categories), `pages/admin/ItemsPage.jsx` (/admin/items)
- `src/pages/NotFound.jsx` (*): antd Result 404 + "Ana səhifəyə qayıt"
- `src/components/public/.gitkeep`, `src/components/admin/.gitkeep`

Silinən şablon faylları: `src/App.css`, `src/assets/*`, `public/icons.svg`, `README.md`.

## Marşrut quruluşu (App.jsx)

```
PublicLayout: /  ,  /menu/:slug
/admin/login                      (layout-suz)
/admin  -> ProtectedRoute -> AdminLayout: index, categories, items, * (admin daxilində 404)
PublicLayout: *  (NotFound)
```

## Müqavilədən kənara çıxmalar (səbəbi ilə)

1. `useAuth()` əlavə olaraq `checking` qaytarır: token var, amma `/auth/me` hələ cavab verməyibsə `true`. ProtectedRoute bu vaxt Loading göstərir. Müqavilədəki sahələr dəyişməyib, yalnız əlavədir.
2. 401 interceptor `/auth/login` sorğusunda işləmir: orada 401 "yanlış parol" deməkdir, sessiya bitməsi deyil. Beləliklə LoginPage xəta mesajını `getErrorMessage` ilə göstərə bilər.
3. `/admin/*` altında naməlum yol AdminLayout daxilində NotFound göstərir (qorunan), qalan bütün naməlum yollar PublicLayout daxilində.
4. `vite.config.js`-də `chunkSizeWarningLimit: 1500`: antd səbəbindən bundle ~920 kB olur və Vite xəbərdarlıq verirdi. Xəta deyildi, sadəcə səs-küyü aradan qaldırır.
5. antd `<App>` komponenti ConfigProvider daxilinə qoyulub ki, Dalğa 2 `App.useApp()` ilə `message`/`modal` istifadə edə bilsin.

## Yoxlama nəticəsi

- `npm run build`: **uğurlu** (3219 modul, `dist/assets/index-*.js` 921 kB, gzip 300 kB, xəbərdarlıq yoxdur). Yoxlamadan sonra `dist/` silindi.
- `npm run lint` (oxlint): xəbərdarlıq/xəta yoxdur.
- Dev server (port 5173): `/`, `/admin/login`, `/admin`, `/menu/x`, `/nonexistent` 200; `src/main.jsx`, `AuthContext.jsx`, `AdminLayout.jsx`, `i18n/index.js` transform olunur (200). `/api/menu` proxy 502 verdi, çünki backend işləmir (gözlənilən, proxy-nin qoşulduğunu göstərir). Server dayandırıldı, port 5173 boşdur.
- Em dash yoxlaması: client fayllarında yoxdur.

## Edə bilmədiklərim

- Səhifələri brauzerdə vizual yoxlamadım (yalnız HTTP 200 və modul transformu). Runtime React xətaları real brauzerdə yoxlanmayıb, amma build və lint təmizdir.
- Backend ilə real login/`/auth/me` axını sınanmayıb (brief backend-i işə salmağı tələb etmirdi).
