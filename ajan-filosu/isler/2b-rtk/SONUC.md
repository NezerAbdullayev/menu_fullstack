# SONUC · 2b-rtk · Dalğa 1.5 (SIRALI)

**Kim:** əsas sessiya (ayrı çalışan açılmadı, iş ortaq fayllara yazdığı üçün tək koşdu).
**Vaxt:** 2026-09-27, təqribən 20:55 - 21:05.
**Səbəb:** istifadəçi qərarı: axios silinsin, state Redux Toolkit, sorğular RTK Query ilə.

## Nə edildi
- Paketlər: `axios` silindi. `@reduxjs/toolkit` 2.12 və `react-redux` 9.3 quraşdırıldı.
- Yeni fayllar:
  - `src/app/store.js`: `configureStore` (auth + api), `setupListeners`, token dəyişəndə localStorage-ə yazma, çıxışda API keşinin təmizlənməsi.
  - `src/features/auth/authSlice.js`: `token`, `admin`; `setCredentials`, `setAdmin`, `logout`; token açarı `menu_token`.
  - `src/features/api/apiSlice.js`: `fetchBaseQuery` (`/api`, Bearer token), 401-də avtomatik `logout` (login istisna), bütün public, auth və admin endpoint-ləri, tag-lər `Category`, `Item`, `Stats`.
  - `src/hooks/useAuth.js`: köhnə `useAuth()` ilə eyni interfeys (`token, admin, isAuthenticated, checking, login, logout`), `/auth/me` ilə bərpa.
  - `src/utils/errors.js`: `getErrorMessage`, `getErrorFields`, `isNetworkError` (RTK xəta formatı).
- Silinən fayllar: `src/api/client.js`, `src/context/AuthContext.jsx`.
- Dəyişən fayllar: `src/main.jsx` (`<Provider store>`), `src/components/ProtectedRoute.jsx` və `src/layouts/AdminLayout.jsx` (yalnız `useAuth` importu).
- Dil i18next-də qaldı (Redux-a köçürülmədi, dublikat olardı).
- Dalğa 2 brief-ləri (3-public, 4-admin) RTK Query hook-larına uyğun yeniləndi.

## Yoxlama
- `npm run build`: xətasız. `npm run lint` (oxlint): xəbərdarlıq yoxdur.
- Köhnə `axios`, `api/client`, `AuthContext` istinadı qalmayıb.
- Backend (Atlas) + Vite dev birlikdə: proxy ilə `/api/health`, `/api/menu`, `/api/auth/login` işləyir. Yeni modullar 200 ilə yüklənir. Portlar sonda boşaldıldı.

## Edilməyən
- Brauzerdə real render (React runtime) yoxlanmayıb. Login axını səhifə səviyyəsində Dalğa 2-dən (4-admin) sonra yoxlanacaq.
