# BRIEF · 3-public · Dalğa 2

## İş
Müştərinin QR ilə açdığı menyu səhifələrini Ant Design ilə yaz: `/` (bölmələr) və `/menu/:slug` (bölmənin məhsulları). Telefon üçün birinci növbədə, kompüterdə də gözəl görünən, **çox sadə** dizayn.

## Kontekst
- Frontend: `C:\Users\nazar.abdullayev\Desktop\menu\menu-app\client` (React 19.3, antd 6.6, react-router-dom 7, react-i18next, Vite). Skeletin hesabatı: `ajan-filosu/isler/2-skelet/SONUC.md`.
- Paralel olaraq başqa işçi (4-admin) `pages/admin/**`, `components/admin/**`, `admin.json` üzərində işləyir.
- Backend (`menu-app/server`, yalnız oxu): `GET /api/menu` → aktiv bölmələr massivi, hər birində `items` massivi; `GET /api/categories` → aktiv bölmələr; `GET /api/categories/:slug/items` → `{category, items}` (bölmə yoxdursa və ya deaktivdirsə 404).
  - Bölmə: `{_id, name:{az,en,ru}, slug, image, order, isActive}`
  - Məhsul: `{_id, category, name:{az,en,ru}, description:{az,en,ru}, price, image, order, isAvailable}`
  - `image` boş sətir və ya `/uploads/xxx.jpg` (vite proxy ilə işləyir).

## Hazır olan və istifadə etməli olduğun şeylər (DƏYİŞMƏ)
- **Məlumat yalnız RTK Query ilə alınır (axios yoxdur, `fetch` də yazma).** `features/api/apiSlice.js`: `useGetMenuQuery()`, `useGetCategoriesQuery()`, `useGetCategoryItemsQuery(slug)`. Hook-lar `{ data, isLoading, isFetching, error, refetch }` qaytarır. Bölmə tapılmadıqda `error.status === 404`.
- `utils/errors.js`: `getErrorMessage(error, fallback)`, `isNetworkError(error)`
- `components/PageState.jsx`: `Loading`, `ErrorState` (`onRetry`), `EmptyState`
- `utils/localize.js`: `localize(obj, lang)`; `utils/format.js`: `formatPrice(n)` → `"12.50 ₼"`
- `i18n/index.js`: `currentLang()`; `useTranslation('public')` öz mətnlərin üçün, ümumi mətnlər `common`-dadır (`loading`, `error`, `retry`, `back`, `empty`, `nav.menu` və s.)
- `layouts/PublicLayout.jsx` başlıq, dil dəyişmə və footer-i artıq verir, Content max 1200px, padding 16.
- Dil dəyişəndə məzmun dərhal yeni dildə görünməlidir (`i18n.resolvedLanguage`-dən asılı render).

## Nə etməli
1. `pages/public/MenuPage.jsx` (`/`):
   - Bölmələri kart şəbəkəsində göstər (antd `Row`/`Col`: xs=12, sm=8, md=6, lg=6 və ya oxşar). Kartda şəkil (yoxdursa sadə ikon/rəngli placeholder) və bölmə adı. Klik → `/menu/:slug`.
   - Yüklənmə, xəta (retry ilə) və boş (heç bölmə yoxdur) halları.
2. `pages/public/CategoryPage.jsx` (`/menu/:slug`):
   - Yuxarıda bütün bölmələr arasında keçid üçün **üfüqi sürüşən** tab/çip zolağı (telefonda yana sürüşür, aktiv bölmə seçilmiş görünür), "Geri" düyməsi və ya link.
   - Məhsul şəbəkəsi: xs=24, sm=12, lg=8, xl=6.
   - Məhsul kartı (`components/public/ItemCard.jsx`): şəkil (varsa, `loading="lazy"`, sabit nisbət, `object-fit: cover`), ad, təsvir (2-3 sətir, uzun olsa kəsilsin), qiymət (`formatPrice`, aydın və böyük). `isAvailable === false` olanda "Hazırda yoxdur" etiketi və solğun görünüş.
   - 404 (bölmə tapılmadı): `ErrorState` və ya `Result` ilə "Bölmə tapılmadı" + ana səhifəyə link. Boş bölmə: `EmptyState`.
   - Slug dəyişəndə məlumat yenidən yüklənməlidir.
3. Lazım olan kiçik komponentləri `components/public/` içində yarat (məs. `CategoryCard.jsx`, `CategoryTabs.jsx`, `ItemCard.jsx`).
4. `i18n/locales/{az,en,ru}/public.json`: öz mətnlərin, üç dildə real tərcümə ("Hazırda yoxdur", "Bölmə tapılmadı", "Bu bölmədə hələ məhsul yoxdur", "Menyu hələ boşdur" və s.).

## Dizayn
- Sadə: ağ kartlar, yumşaq kölgə, skeletin `colorPrimary` (#c0392b) rəngi yalnız vurğu üçün (qiymət, aktiv tab).
- Heç bir səhifədə üfüqi scroll olmasın (tab zolağından başqa). 360px enində yoxla.
- Inline style və ya antd `theme.useToken()` istifadə et. `index.css`-ə toxunma. Lazımdırsa `components/public/public.css` yarat və komponentdən import et.

## YAZA BİLƏCƏYİN yerlər (yalnız bunlar)
- `menu-app/client/src/pages/public/**`
- `menu-app/client/src/components/public/**`
- `menu-app/client/src/i18n/locales/az/public.json`, `en/public.json`, `ru/public.json`
- `ajan-filosu/isler/3-public/SONUC.md`

## QADAĞALAR
- `App.jsx`, `main.jsx`, `package.json`, `vite.config.js`, `index.css`, `common.json`, `admin.json`, `layouts/`, `app/`, `features/`, `hooks/`, `utils/`, `components/*.jsx` (kökdəki ortaq komponentlər) və `pages/admin/**`, `components/admin/**` fayllarına **toxunma**. Ortaq faylda dəyişiklik lazımdırsa, etmə, SONUC-da "5-inteqrasiya üçün təklif" kimi yaz.
- Yeni npm paketi quraşdırma.
- `menu-app/server/`-ə toxunma. Real Atlas bazasına qoşulma, `.env`-ə baxma.
- Em dash (uzun tire) istifadə etmə.

## Yoxlama
- `npm run build` xətasız keçməlidir (dist-i sonra sil).
- Mümkünsə: backend-i yaddaş bazası ilə işə salmaq lazım deyil. Build + kodun oxunması kifayətdir. Dev server işə salsan, sonda dayandır (port 5173 boş qalsın). **Diqqət:** 4-admin də eyni vaxtda build edə bilər. Build-dən sonra yalnız `dist`-i sil, başqa heç nəyi.

## Bitəndə
`ajan-filosu/isler/3-public/SONUC.md` (Azərbaycan dilində): başlama/bitmə vaxtı, yaradılan fayllar, dizayn qərarları, build nəticəsi, 5-inteqrasiya üçün təkliflər, nəyi edə bilmədin. Uydurma "bitdi" yazma.
