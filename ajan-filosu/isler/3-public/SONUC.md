# SONUC · 3-public · Dalğa 2

- Başlama: 2026-09-27 22:07
- Bitmə: 2026-09-27 22:10
- Status: **bitdi** (build və lint təmiz). Brauzerdə vizual yoxlama edilməyib (aşağıya bax).

## Yaradılan / dəyişən fayllar (`menu-app/client/src/`)

- `pages/public/MenuPage.jsx` (stub əvəz olundu): `/`, `useGetCategoriesQuery()` ilə bölmələr, `Row gutter [12,12]`, `Col xs=12 sm=8 md=6` (lg da 6). Yüklənmə (`Loading`), xəta (`ErrorState` + `refetch`, şəbəkə xətasında `common:networkError`), boş (`EmptyState` "Menyu hələ boşdur").
- `pages/public/CategoryPage.jsx` (stub əvəz olundu): `/menu/:slug`. Yuxarıda "Geri" düyməsi (`/`-a) + bölmə adı, altında bölmə zolağı, sonra məhsul şəbəkəsi `xs=24 sm=12 lg=8 xl=6`. 404 halında antd `Result status="404"` ("Bölmə tapılmadı" + "Ana səhifəyə qayıt"), digər xətalar `ErrorState` (retry), boş bölmə `EmptyState`.
- `components/public/CategoryCard.jsx`: `Link` kart, 4:3 şəkil və ya placeholder ikon, ad (2 sətirə qədər).
- `components/public/ItemCard.jsx`: 16:10 şəkil (`loading="lazy"`, `object-fit: cover`), ad (2 sətir), təsvir (3 sətir, kəsilir, tam mətn `title`-da), qiymət `formatPrice` ilə 18px qalın `colorPrimary`. `isAvailable === false` olduqda "Hazırda yoxdur" `Tag`-ı, şəkil boz və solğun, mətn solğun.
- `components/public/CategoryTabs.jsx`: `<nav>` içində `Link` çiplər, yalnız zolaq üfüqi sürüşür (scrollbar gizli), aktiv çip `colorPrimary` fonda, `aria-current="page"`, aktiv çip avtomatik zolağın ortasına sürüşdürülür (səhifə özü sürüşmür).
- `components/public/MediaImage.jsx`: sabit `aspect-ratio` sahəsi; şəkil boşdursa və ya yüklənməsə (`onError`) placeholder ikon.
- `components/public/public.css`: kart kölgəsi, hover, line-clamp, zolaq üslubları (`pm-` prefiksi ilə, qlobal toqquşma olmasın).
- `components/public/.gitkeep` silindi (qovluq artıq boş deyil).
- `i18n/locales/{az,en,ru}/public.json`: `menuTitle`, `menuSubtitle`, `menuEmpty`, `categoriesNav`, `categoryEmpty`, `categoryNotFound`, `categoryNotFoundDescription`, `unavailable` (üç dildə real tərcümə).

Ortaq fayllara (App.jsx, layouts, features, utils, common.json və s.) və admin fayllarına toxunulmayıb.

## Dizayn qərarları

- Məlumat yalnız RTK Query hook-ları ilə. `CategoryPage` `currentData` istifadə edir: slug dəyişəndə köhnə bölmənin məhsulları göstərilmir, yeni sorğu avtomatik gedir (hook arqumenti dəyişir), bu vaxt `Loading` görünür. Bölmə siyahısı ana səhifədən keşdə qalır, zolaq dərhal görünür.
- Dil: hər iki səhifə `i18n.resolvedLanguage`-dən `lang` alır və `localize(..., lang)` ilə render edir, `useTranslation` dil dəyişəndə yenidən render edir, məzmun dərhal yeni dildə olur.
- Bölmə adı başlıqda `category.name`-dən, o hələ yoxdursa keşdəki siyahıdan götürülür.
- Zolaq üçün antd `Tabs` yox, sadə link çiplər seçildi: antd Tabs mobil ekranda "daha çox" menyusu açır, çiplər isə barmaqla yana sürüşür və hər biri həqiqi link olduğu üçün yeni tabda açmaq, geri düyməsi işləyir.
- Rəng: ağ kartlar, yumşaq kölgə, radius 12, `colorPrimary` yalnız qiymətdə, aktiv çipdə, placeholder ikonunda və fokus konturunda. İnline style + `theme.useToken()` + kiçik CSS faylı; `index.css`-ə toxunulmayıb.
- 360px: Content padding 16, `Row` gutter 12 (mənfi margin 6px padding daxilində qalır), mətnlərdə `overflow-wrap: anywhere`, başlıq `ellipsis`, qiymət sırası `flex-wrap`. Üfüqi sürüşmə yalnız `.pm-tabs`-da (`max-width: 100%`, `overflow-x: auto`).
- Əlçatanlıq: kartlar və çiplər klaviatura ilə fokuslanır (`focus-visible` kontur), şəkillərin `alt` mətni ad ilədir, placeholder `aria-hidden`.

## Yoxlama nəticəsi

- `npm run lint` (oxlint): xəbərdarlıq/xəta yoxdur.
- `npm run build`: uğurlu (3185 modul, JS 966 kB / gzip 313 kB, CSS 2.09 kB). Sonra yalnız `dist/` silindi.
- Em dash yoxlaması: mənim fayllarımda yoxdur.
- Dev server işə salınmayıb, port 5173-ə toxunulmayıb.

## 5-inteqrasiya üçün təkliflər

1. Real brauzerdə 360px və masaüstündə vizual yoxlama (backend + test data ilə): bölmə kartları, zolağın sürüşməsi, 404 (`/menu/yoxdur`), deaktiv məhsul görünüşü, dil dəyişməsi.
2. `PageState.jsx`-dəki `Loading` hələ də `tip` adlı prop qəbul edir (daxildə `description`-a ötürülür, xəbərdarlıq yoxdur), istəyə görə prop adı `description` edilə bilər. Mən onu prop-suz istifadə etmişəm.
3. Bölmə kartında məhsul sayı göstərmək istənsə, `useGetMenuQuery()` (items ilə) istifadə oluna bilər; indi daha yüngül `/categories` istifadə olunur. `useGetMenuQuery` hazırda public səhifələrdə istifadə olunmur.
4. `PublicLayout` başlığında `siteTagline` (common.json-da var) göstərilmir; lazım olsa layout-a əlavə edilə bilər.
5. Bundle ~966 kB: istəsəniz admin səhifələri `React.lazy` ilə ayrı chunk-a çıxarıla bilər (App.jsx dəyişikliyi), müştəri QR ilə açanda daha tez yüklənər.

## Edə bilmədiklərim

- Səhifələri real brauzerdə render edib baxmadım (brief build + kod oxunmasını kifayət sayırdı). Runtime React xətaları brauzerdə yoxlanmayıb; build və lint təmizdir.
- Backend ilə real məlumat üzərində sınaq edilməyib.
