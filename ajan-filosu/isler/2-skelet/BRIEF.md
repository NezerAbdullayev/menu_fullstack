# BRIEF · 2-skelet · Dalğa 1

## İş
`menu-app/client` içində React frontend-in skeletini qur: Vite + React, Ant Design, React Router, i18next (az/en/ru), axios, AuthContext, layout-lar və səhifə stub-ları. Dalğa 2-dəki iki işçi (public səhifələr və admin panel) bu skeletin üzərində **paralel** işləyəcək, ona görə aşağıdakı müqavilə dəqiq yerinə yetirilməlidir.

## Kontekst
- Layihə: `C:\Users\nazar.abdullayev\Desktop\menu\menu-app`. Backend `menu-app/server`-dədir, `http://localhost:5000`-də işləyir (ona toxunma, yalnız oxu).
- Backend API:
  - Public: `GET /api/menu` (aktiv bölmələr + `items`), `GET /api/categories`, `GET /api/categories/:slug/items` → `{category, items}`
  - Auth: `POST /api/auth/login` `{email,password}` → `{token, admin}`, `GET /api/auth/me`
  - Admin (Bearer token): `GET /api/admin/stats`, `/api/admin/categories` və `/api/admin/items` (GET list, GET/:id, POST, PUT/:id, DELETE/:id, items üçün `?category=id` filtri), `PATCH /api/admin/reorder` `{type:'category'|'item', ids:[]}`, `POST /api/admin/upload` (multipart, sahə `image`) → `{url:'/uploads/...'}`
  - Lokallaşdırılmış sahələr: `name: {az,en,ru}`, `description: {az,en,ru}`. Xəta cavabı: `{message, errors?}`.
- Windows, Node 24. Paketləri Bash ilə quraşdır.

## Texnologiya
- Vite (React şablonu, JavaScript, TypeScript deyil)
- `antd`, `@ant-design/icons`, `react-router-dom`, `axios`, `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- **React və antd versiyalarının uyğunluğunu yoxla** (məs. antd v5 + React 19 patch tələb edir, ya da React 19-u dəstəkləyən antd versiyası seç). Dalğa 2 heç bir paket əlavə etməyəcək, lazım olan hər şeyi (o cümlədən ikonları) indi quraşdır.

## Müqavilə (Dalğa 2 buna güvənir)
```
client/
  vite.config.js           proxy: /api və /uploads -> http://localhost:5000
  src/main.jsx             BrowserRouter, AuthProvider, i18n import
  src/App.jsx              BÜTÜN marşrutlar burada (Dalğa 2 bu faylı dəyişməyəcək)
  src/i18n/index.js        az (default, fallback), en, ru; namespace-lər: common (default), public, admin; dil localStorage-də saxlanır
  src/i18n/locales/{az,en,ru}/common.json   ümumi mətnlər (sayt adı, dil adları, "Yüklənir", "Xəta baş verdi", "Yenidən cəhd et", "Geri", "Səhifə tapılmadı" və s.)
  src/i18n/locales/{az,en,ru}/public.json   yalnız `{}` (Dalğa 2 · 3-public dolduracaq)
  src/i18n/locales/{az,en,ru}/admin.json    yalnız `{}` (Dalğa 2 · 4-admin dolduracaq)
  src/api/client.js        axios instansı, baseURL '/api', token interceptor, 401-də token silinir və 'auth:logout' hadisəsi
  src/context/AuthContext.jsx  useAuth(): { token, admin, isAuthenticated, login(email,password), logout() }, token localStorage 'menu_token'
  src/components/ProtectedRoute.jsx   giriş yoxdursa /admin/login-ə yönləndirir
  src/components/LangSwitcher.jsx     az/en/ru seçimi (antd Segmented və ya Select)
  src/components/PageState.jsx        ortaq Loading / Error (retry ilə) / Empty komponentləri
  src/layouts/PublicLayout.jsx        başlıq (sayt adı + LangSwitcher), <Outlet/>, sadə footer
  src/layouts/AdminLayout.jsx         antd Layout + Sider menyu (Dashboard, Bölmələr, Məhsullar, Çıxış), mobildə yığılır, <Outlet/>
  src/utils/localize.js    localize(obj, lang) -> obj[lang] || obj.az || ''
  src/utils/format.js      formatPrice(n) -> "12.50 ₼"
  src/pages/public/MenuPage.jsx        "/"            stub
  src/pages/public/CategoryPage.jsx    "/menu/:slug"  stub
  src/pages/admin/LoginPage.jsx        "/admin/login" stub (AdminLayout-suz)
  src/pages/admin/DashboardPage.jsx    "/admin"       stub (ProtectedRoute + AdminLayout)
  src/pages/admin/CategoriesPage.jsx   "/admin/categories" stub
  src/pages/admin/ItemsPage.jsx        "/admin/items" stub
  src/pages/NotFound.jsx               "*"
```
- `ConfigProvider` antd locale-ını seçilmiş dilə görə dəyişsin (az_AZ, en_US, ru_RU), sadə tema (bir əsas rəng).
- Stub səhifə: sadəcə başlıq və "hazırlanır" mətni, default export.
- Qovluqlar `src/components/public/` və `src/components/admin/` boş yaradılsın (`.gitkeep`).
- `client/.gitignore` (node_modules, dist).

## YAZA BİLƏCƏYİN yerlər
- `menu-app/client/**` (yalnız bu qovluq)
- `ajan-filosu/isler/2-skelet/SONUC.md`

## QADAĞALAR
- `menu-app/server/`-ə toxunma (başqa işçi orada işləyir).
- Backend-i işə salmağa ehtiyac yoxdur.
- Em dash (uzun tire) istifadə etmə.

## Yoxlama
`npm run build` xətasız keçməlidir. Dev serveri qısa müddət işə salıb (məs. port 5173) `/` və `/admin/login` səhifələrinin 200 qaytardığını yoxla, sonra dayandır.

## Bitəndə
`ajan-filosu/isler/2-skelet/SONUC.md` yaz: quraşdırılan paketlər və versiyaları, yaradılan fayllar, müqavilədən kənara çıxdığın hər şey (səbəbi ilə), build nəticəsi, nəyi edə bilmədin. Uydurma "bitdi" yazma. Başlama və bitmə vaxtını da yaz.
