# BRIEF · 4-admin · Dalğa 2

## İş
Admin paneli Ant Design ilə yaz: login, dashboard, bölmələr və məhsulların idarəsi (yaratmaq, redaktə, silmək, sıralamaq, aktiv/deaktiv, şəkil yükləmə). Az/en/ru məzmun xanaları. Telefonda da istifadə oluna bilməlidir.

## Kontekst
- Frontend: `C:\Users\nazar.abdullayev\Desktop\menu\menu-app\client` (React 19.3, antd 6.6, @ant-design/icons 6, react-router-dom 7, react-i18next, Vite). Skeletin hesabatı: `ajan-filosu/isler/2-skelet/SONUC.md`.
- Paralel olaraq başqa işçi (3-public) `pages/public/**`, `components/public/**`, `public.json` üzərində işləyir.
- antd v6: bəzi v5 prop-ları köhnəlib (məs. `Spin tip` → `description`, `Modal destroyOnClose` → `destroyOnHidden`, `visible` → `open`). Konsol xəbərdarlıqlarından qaçmaq üçün v6 API-ni istifadə et.

## Backend API (`menu-app/server`, yalnız oxu)
- `POST /api/auth/login` `{email,password}` → `{token, admin}` (yanlışda 401, çox cəhddə 429)
- Admin (Bearer token, `api` avtomatik əlavə edir):
  - `GET /admin/stats` → `{categories, items, unavailable}`
  - `GET /admin/categories` → bölmələr, hər birində `itemCount`; `GET/PUT/DELETE /admin/categories/:id`; `POST /admin/categories`
  - Bölmə body: `{name:{az (mütləq),en,ru}, slug? (boşdursa az addan avtomatik), image, order, isActive}`. Eyni slug → 409. İçində məhsul olan bölməni silmək → 409 `{message}`.
  - `GET /admin/items?category=<id>` → məhsullar (`category` populate olunub: `{_id,name,slug}`); `GET/PUT/DELETE /admin/items/:id`; `POST /admin/items`
  - Məhsul body: `{category:<id> (mütləq), name:{az (mütləq),en,ru}, description:{az,en,ru}, price (>=0), image, order, isAvailable}`
  - **PUT tam obyekt tələb edir** (zod eyni sxemi yoxlayır). Switch ilə tək sahə dəyişəndə də tam body göndər; məhsulda `category` populate olunmuş obyekt gəlir, göndərəndə yalnız `_id` yaz.
  - `PATCH /admin/reorder` `{type:'category'|'item', ids:[...]}` → `order` = massivdəki indeks
  - `POST /admin/upload` multipart, sahə adı `image`, JPG/PNG/WEBP, max 5 MB → `{url:'/uploads/...'}`
  - Xəta cavabı: `{message, errors?:[{path,message}]}`

## Hazır olan və istifadə etməli olduğun şeylər (DƏYİŞMƏ)
- **Məlumat yalnız RTK Query ilə (Redux Toolkit) alınır. axios yoxdur, `fetch` də yazma.** `features/api/apiSlice.js` bütün endpoint-ləri artıq təyin edir:
  - Query: `useGetStatsQuery()`, `useGetAdminCategoriesQuery()`, `useGetAdminCategoryQuery(id)`, `useGetAdminItemsQuery(categoryId | undefined)`, `useGetAdminItemQuery(id)`
  - Mutation: `useCreateCategoryMutation`, `useUpdateCategoryMutation` (`{id, ...body}`), `useDeleteCategoryMutation` (`id`), `useCreateItemMutation`, `useUpdateItemMutation` (`{id, ...body}`), `useDeleteItemMutation` (`id`), `useReorderMutation` (`{type, ids}`), `useUploadImageMutation` (`File` → `{url}`)
  - Mutation nəticəsi üçün `await trigger(arg).unwrap()`, xətada `catch (err)`.
  - **Tag-lər avtomatik yeniləmə edir:** mutation-dan sonra siyahı və statistika özü yenidən yüklənir, əl ilə `refetch` lazım deyil.
  - 401-də token avtomatik silinir və `ProtectedRoute` login-ə yönləndirir (login sorğusu istisnadır).
- `utils/errors.js`: `getErrorMessage(error, fallback)`, `getErrorFields(error)`, `isNetworkError(error)`. RTK xətası: `{ status, data: { message, errors? } }`, şəbəkə xətası `status === 'FETCH_ERROR'`.
- `hooks/useAuth.js`: `useAuth()` → `{token, admin, isAuthenticated, checking, login(email,password), logout()}`. `login` promise qaytarır, xətada RTK xətası ilə reject olur.
- `ProtectedRoute` `navigate` zamanı `state.from` verir. `AdminLayout` Sider, dil dəyişmə və çıxışı artıq edir.
- `components/PageState.jsx`: `Loading`, `ErrorState`, `EmptyState`
- `utils/localize.js`: `localize(obj, lang)`; `utils/format.js`: `formatPrice`
- `i18n`: `currentLang()`; `useTranslation('admin')` öz mətnlərin üçün; ümumi düymə mətnləri `common`-dadır (`save`, `cancel`, `delete`, `edit`, `add`, `yes`, `no`, `actions`, `nav.*`, `sessionExpired`).
- antd `<App>` wrapper var: `App.useApp()` ilə `message`, `modal`, `notification` istifadə et (statik `message.success` yox).

## Nə etməli
1. `pages/admin/LoginPage.jsx` (`/admin/login`, layout-suz): mərkəzdə kart, email + parol Form, xəta mesajı (401, 429, şəbəkə), uğurda `state.from` və ya `/admin`-ə keç. Artıq daxil olubsa `/admin`-ə yönləndir. Yuxarıda `LangSwitcher` (`components/LangSwitcher.jsx`, import et).
2. `pages/admin/DashboardPage.jsx` (`/admin`): 3 `Statistic` kartı (bölmə, məhsul, mövcud olmayan), bölmələr və məhsullar səhifəsinə sürətli keçid, sayta baxmaq üçün `/` linki (yeni tab).
3. `pages/admin/CategoriesPage.jsx`: `Table` (sıra düymələri yuxarı/aşağı, şəkil miniatürü, ad az + kiçik en/ru, slug, məhsul sayı, aktiv `Switch`, redaktə/sil `Popconfirm`), "Əlavə et" düyməsi, `Modal` + `Form` (az/en/ru ad xanaları, məs. `Tabs` və ya üç `Input`; slug istəyə görə; aktiv; şəkil). Sıralama: yerini dəyiş → bütün id-lərin yeni sırasını `PATCH /reorder`-ə göndər → siyahını yenilə. 409 mesajlarını göstər.
4. `pages/admin/ItemsPage.jsx`: bölməyə görə filtr (`Select`, URL query `?category=` ilə saxlanılsa yaxşı olar), `Table` (şəkil, ad, bölmə, qiymət, mövcudluq `Switch`, redaktə/sil), `Modal` + `Form` (bölmə `Select`, az/en/ru ad və təsvir, qiymət `InputNumber` min 0 addım 0.1, mövcudluq, şəkil). Sıralama düymələri yalnız bir bölmə seçiləndə aktiv olsun (o bölmənin id-ləri göndərilir).
5. `components/admin/ImageUpload.jsx`: Form üçün kontrollu komponent (`value` = url sətri, `onChange(url)`), antd `Upload` + `customRequest` ilə `useUploadImageMutation` (`uploadImage(file).unwrap()`), önizləmə, silmək düyməsi, qəbul: jpg/png/webp, klient tərəfində 5 MB yoxlaması.
6. Digər köməkçi komponentlər `components/admin/` içində (məs. `LocalizedInputs.jsx`, `CategoryFormModal.jsx`, `ItemFormModal.jsx`).
7. `i18n/locales/{az,en,ru}/admin.json`: bütün admin mətnləri üç dildə real tərcümə.

## Responsiv
- `Table` üçün `scroll={{ x: ... }}`, mobildə az vacib sütunlar gizlənə bilər (`responsive: ['md']`).
- Modal telefonda ekran eninə sığsın.

## YAZA BİLƏCƏYİN yerlər (yalnız bunlar)
- `menu-app/client/src/pages/admin/**`
- `menu-app/client/src/components/admin/**`
- `menu-app/client/src/i18n/locales/az/admin.json`, `en/admin.json`, `ru/admin.json`
- `ajan-filosu/isler/4-admin/SONUC.md`

## QADAĞALAR
- `App.jsx`, `main.jsx`, `package.json`, `vite.config.js`, `index.css`, `common.json`, `public.json`, `layouts/`, `app/`, `features/`, `hooks/`, `utils/`, `components/*.jsx` (kökdəki ortaq komponentlər) və `pages/public/**`, `components/public/**` fayllarına **toxunma**. Ortaq faylda dəyişiklik lazımdırsa, etmə, SONUC-da "5-inteqrasiya üçün təklif" kimi yaz.
- Yeni npm paketi quraşdırma (drag-and-drop kitabxanası da yox, yuxarı/aşağı düymələri kifayətdir).
- `menu-app/server/`-ə toxunma. Real Atlas bazasına qoşulma, `.env`-ə baxma.
- Em dash (uzun tire) istifadə etmə.

## Yoxlama
- `npm run build` xətasız keçməlidir (dist-i sonra sil). **Diqqət:** 3-public də eyni vaxtda build edə bilər. Build-dən sonra yalnız `dist`-i sil, başqa heç nəyi.
- Dev server işə salsan, sonda dayandır (port 5173 boş qalsın).

## Bitəndə
`ajan-filosu/isler/4-admin/SONUC.md` (Azərbaycan dilində): başlama/bitmə vaxtı, yaradılan fayllar, əsas qərarlar, build nəticəsi, 5-inteqrasiya üçün təkliflər, nəyi edə bilmədin. Uydurma "bitdi" yazma.
