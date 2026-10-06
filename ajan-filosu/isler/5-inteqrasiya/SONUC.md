# SONUC · 5-inteqrasiya · Dalğa 3

- Başlama: 2026-09-27 22:44
- Bitmə: 2026-09-27 23:02
- Status: **bitdi**. Bütün avtomatik brauzer yoxlamaları keçdi, 2 xəta düzəldildi, lazy load edildi, README yazıldı. `npm run build` və `npm run lint` təmiz, `dist` silindi.

## Necə sınadım

- **Baza:** yalnız yaddaş bazası (`mongodb-memory-server`). Real Atlas bazasına qoşulma olmadı, `server/.env` oxunmadı və dəyişdirilmədi, `npm run dev/start/seed*` işlədilmədi.
- **Backend:** `scratchpad/apitest/devserver.mjs`. `MONGO_URI` silinir, yaddaş bazası yaradılır (URI-nin `mongodb://127.0.0.1` ilə başladığı yoxlanır), `JWT_SECRET` və `CLIENT_URL` `process.env`-də təyin olunur. `seedDemo.js` ayrıca prosesdə `--env-file` olmadan, yaddaş bazasının URI-si ilə işlədildi (3 bölmə, 10 məhsul). Üstəlik kənar hallar əlavə olundu: deaktiv bölmə `gizli` (1 məhsulla), boş bölmə `bos`, "Limonad" mövcud deyil, çox uzun ad, boşluqsuz uzun ingilis sözü və uzun təsvirli məhsul. Admin `admin@menu.az` / `Admin12345`. `server/src/app.js` import edilib port 5000-də dinlədi.
- **Frontend:** Vite dev (5173, proxy ilə). Sonda eyni testlər production build üzərində `vite preview` (4173, eyni proxy) ilə təkrarlandı.
- **Alət:** Playwright + Chromium, yalnız scratchpad-da (`scratchpad/pw`). Layihəyə paket əlavə olunmadı. Qeyd: Playwright Chromium-u öz standart keşinə (`%LOCALAPPDATA%\ms-playwright`) endirir, lazım deyilsə o qovluq silinə bilər.
- **Skriptlər:** `pw/public.mjs` (45 yoxlama), `pw/admin.mjs` (51 yoxlama), `pw/chunks.mjs` (2), `pw/ratelimit.mjs` (1), `pw/probe404.mjs` (şəkil silmə yoxlaması). Konsol `error`/`warning` mesajları, `pageerror` və 4xx/5xx cavablar toplandı.
- **Ekran şəkilləri:** 360, 375 və 1280 px. Seçilmişləri `ajan-filosu/isler/5-inteqrasiya/ekran/` qovluğundadır (13 fayl).
- **uploads:** test əvvəli qovluqda `.gitkeep` və istifadəçinin `1790533805483-ae3fbb282f4a.png` faylı var idi, onlara toxunulmadı. Test faylları server tərəfindən (şəkil dəyişəndə və məhsul/bölmə silinəndə) silindi. Birinci admin qaçışı ortada kəsildiyi üçün qalan 1 test faylını (`1790534970605-c672e4d2c4a5.png`) əl ilə sildim. Sonda qovluqda yalnız ilkin 2 fayl var.

## Keçən yoxlamalar

Dev serverdə və production build-də (preview) eyni nəticə: **public 45/45, admin 51/51, chunk 2/2, rate limit 1/1, 0 keçməyən.**

Müştəri (360, 375, 1280 px):
- `/`: 4 aktiv bölmə kartı, deaktiv bölmə görünmür, üfüqi scroll yoxdur.
- `/menu/ickiler`: 5 məhsul, "Limonad" boz və "Hazırda yoxdur" etiketi ilə, uzun ad 2 sətirdə, təsvir 3 sətirdə kəsilir, boşluqsuz uzun söz daşmır.
- Çiplər arası keçid (aktiv çip dəyişir, məhsullar yenilənir).
- Boş bölmə: EmptyState. Deaktiv bölmə (`/menu/gizli`) və olmayan slug: "Bölmə tapılmadı" 404. Bilinməyən səhifə: 404.
- Dil: AZ -> EN -> RU, məzmun və UI dərhal dəyişir, `<html lang>` yenilənir, səhifə yeniləndikdən sonra dil qalır, RU-da da üfüqi scroll yoxdur.
- Şəbəkə xətası (sorğu kəsildi): ErrorState + "Yenidən cəhd et" işləyir. 500 cavabı: ErrorState.

Admin (1280 px + mobil 360/375 px):
- Token olmadan `/admin/items?category=...` -> `/admin/login`, girişdən sonra həmin ünvana qayıdış.
- Yanlış parol: "Email və ya parol yanlışdır". Yanlış email formatı: klient xətası. Böyük hərf və boşluqlu email ilə giriş işləyir.
- Səhifə yenilənəndə sessiya qalır. Çıxış: token silinir, `/admin` yenidən login-ə aparır. Pozulmuş token: `/auth/me` 401 -> login.
- Rate limit: 11-ci cəhddə 429 və "Çox cəhd edildi" mesajı.
- Statistika 5/12/1, yeni bölmədən sonra avtomatik 6, mövcudluq switch-i sonrası `unavailable` 2.
- Bölmə: boş ad validasiyası, slug 409 slug xanasında göstərilir, şəkil yükləmə, yeni bölmə siyahının sonuna düşür, public-də görünür, aktiv switch public-dən gizlədir/qaytarır, sıralama (yuxarı), redaktə modalı dəyərlərlə dolur, şəkil dəyişəndə köhnə fayl silinir.
- Məhsulu olan bölmə: Popconfirm-də sil düyməsi deaktiv, xəbərdarlıq mətni var, server DELETE 409.
- Məhsul: bölmə filtri (URL `?category=`), yeni məhsul modalında bölmə filtrdən gəlir, mənfi qiymət validasiya xətası (düzəlişdən sonra), şəkilli yaratma, ikinci məhsul sonda, sıralama, mövcudluq switch-i və public-də `isAvailable=false`, şəkil dəyişəndə köhnə fayl silinir, "Şəkli sil" ilə fayl silinir, bölmənin `itemCount`-u avtomatik yenilənir, `.txt` fayl rədd edilir, məhsul və boş bölmə silinir (şəkilləri ilə).
- Mobil: sider açılışda bağlıdır, açılanda overlay ilə, menyu seçiləndə bağlanır. Dashboard, bölmələr, məhsullar səhifələrində səhifə səviyyəsində üfüqi scroll yoxdur (cədvəl öz daxilində sürüşür), modal ekrana sığır.
- React/antd xəbərdarlığı (köhnəlmiş prop və s.): **heç biri yoxdur** (StrictMode dev rejimində). Konsoldakı yeganə mesajlar gözlənilən 4xx/5xx şəbəkə cavablarıdır (401 yanlış parol, 404 bölmə, 409 slug və s.).

## Tapılan və düzəldilən xətalar

1. **Mənfi qiymət səssizcə 0 kimi yadda saxlanırdı** · `client/src/components/admin/ItemFormModal.jsx:105-106`. `InputNumber min={0}` blur zamanı `-5`-i xəbərdarlıqsız `0`-a çevirirdi, validasiya qaydası (`min 0`) heç işə düşmürdü və məhsul 0 ₼ qiymətlə yaradılırdı (testdə sübut olundu). `min` çıxarıldı, indi "Qiymət mənfi ola bilməz" xətası göstərilir və modal açıq qalır.
2. **"Əməliyyatlar" sütun başlığı iki sətirə bölünürdü** ("Əməliyyatla / r"), həm masaüstündə, həm mobildə · `client/src/pages/admin/CategoriesPage.jsx:163`, `client/src/pages/admin/ItemsPage.jsx:194`. Sütun eni 110 -> 130.
3. **Müştəri menyusu istifadə olunmayan antd Select-i yükləyirdi** · `client/src/components/LangSwitcher.jsx:1-10`. `variant="select"` heç yerdə istifadə olunmurdu, amma Select (~78 kB, gzip ~26 kB) ilk yüklənən JS-ə düşürdü. Variant çıxarıldı, Segmented qaldı.

## Lazy load

- `client/src/App.jsx:1,18-22,40-67`: `AdminLayout`, `LoginPage`, `DashboardPage`, `CategoriesPage`, `ItemsPage` `React.lazy` ilə, `Routes` `Suspense` (`<Loading fullscreen />`) içində. Public səhifələr, `ProtectedRoute` və `NotFound` adi import.
- `client/src/layouts/AdminLayout.jsx:1,131-133`: `Outlet` ayrıca `Suspense` (`<Loading />`) ilə, admin səhifələri arasında keçəndə menyu və başlıq yerində qalır.
- Production-da yoxlandı: `/menu/ickiler` açanda heç bir admin chunk-ı yüklənmir, `/admin` açanda `LoginPage` chunk-ı sonradan gəlir.

| | Müştəri menyusunun ilk JS-i | gzip |
|---|---|---|
| Əvvəl (tək bundle) | 1415.03 kB | 451.48 kB |
| Lazy load-dan sonra | 936.88 kB | 308.91 kB |
| + LangSwitcher Select-siz (son) | **859.18 kB** | **283.03 kB** |

Yəni ilk yüklənən JS təxminən 39% (gzip 37%) azaldı. Cəmi JS dəyişmədi (~1428 kB), qalanı admin chunk-larıdır (ən böyüyü `ItemsPage` 27.8 kB + ortaq antd hissələri).

- `client/vite.config.js:8-10`: `chunkSizeWarningLimit` 1500 -> 700. Ən böyük chunk react + antd nüvəsidir (~612 kB), yeni böyük asılılıq gəlsə xəbərdarlıq görünəcək. Build xəbərdarlıqsız keçir.

## Kiçik cilalama

- `client/src/components/PageState.jsx:4-5,17`: `Loading` prop-u `tip` -> `description`. Layihədə `tip` ilə çağırış yox idi, yalnız prop-suz istifadə olunur, başqa dəyişiklik lazım olmadı.
- Digər işçilərin təkliflərindən: 3-public #2 və #5, 4-admin #4 və #5 (yuxarıdakılar) edildi. 4-admin #2 dəyişiklik tələb etmir (yoxlandı: switch və mutation-lardan sonra siyahı, say və statistika avtomatik yenilənir).

## README

`menu-app/README.md` (Azərbaycan dilində): təsvir, texnologiyalar, qovluq quruluşu, tələblər (Node 24, MongoDB/Atlas), `.env` dəyişənləri (`.env.example`-a istinad, real dəyər yoxdur), quraşdırma, `npm run seed`, `npm run seed:demo`, backend və frontend-i işə salma, telefonda sınama (`npm run dev -- --host`), build/preview/lint, bütün API endpoint-lərinin cədvəli.

## Edilməyənlər və gələcək üçün təkliflər

1. **Server xəta mesajlarının tərcüməsi: bu dalğada edilmədi** (istifadəçi qərarı gözlənilir). Hazırda server mesajları yalnız azərbaycancadır, klient 401/409/429 kimi məlum halları özü tərcümə edir, qalan hallarda (məs. zod validasiya mesajları) EN/RU interfeysdə azərbaycanca mətn görünə bilər. Təklif: server `code` sahəsi qaytarsın (`SLUG_TAKEN`, `CATEGORY_HAS_ITEMS`, `VALIDATION`), klient onu tərcümə etsin.
2. **Yetim şəkillər:** modalda şəkil yüklənib sonra "Ləğv et" basılarsa və ya eyni modalda şəkil iki dəfə dəyişdirilərsə, saxlanmayan fayllar `uploads/`-da qalır (server yalnız yadda saxlanan köhnə şəkli silir). Həll server tərəfində lazımdır (məs. heç bir qeydə bağlı olmayan faylları təmizləyən skript), bu dalğada toxunmadım.
3. Məhsul şəkli dəyişəndə və ya silinəndə bəzən konsolda silinmiş köhnə şəkil üçün bir dəfəlik `404 /uploads/...` görünür (cədvəl yeni siyahı gələnə qədər köhnə URL-i göstərir). Funksional təsiri yoxdur.
4. Mobil admin cədvəllərində qiymət və mövcudluq switch-i görmək üçün cədvəli yana sürüşdürmək lazımdır (360 px-də görünən sütunlar: sıra, ad, əməliyyatlar). İşləyir, amma tez-tez istifadə olunarsa mobil üçün kart görünüşü və ya sütunların yenidən düzülməsi düşünülə bilər.
5. Səs-küy yoxdur, amma qeyd: brauzer dili ingiliscə olan müştəri ilk açılışda interfeysi ingiliscə görür (detektor `navigator`-dan oxuyur). Bu dizayn qərarıdır, dəyişdirilmədi.
6. `PublicLayout` başlığında `siteTagline` göstərilmir (3-public #4), dizayn qərarı olduğu üçün toxunmadım.

## Deploy üçün qeydlər

- `JWT_SECRET` mütləq uzun təsadüfi dəyər olsun, `ADMIN_PASSWORD` güclü seçilsin.
- `CLIENT_URL`-ə production domeni yazılmalıdır (vergüllə bir neçə origin olar).
- Proksi (Nginx, Render və s.) arxasında login rate limit üçün Express-də `trust proxy` ayarlanmalıdır, əks halda bütün istifadəçilər bir IP sayıla bilər (1-backend-in qeydi, hələ edilməyib).
- `server/uploads/` davamlı disk olmalıdır (bəzi hostinqlərdə fayl sistemi hər deploy-da silinir).
- Frontend SPA-dır: statik serverdə naməlum yollar `index.html`-ə yönləndirilməli, `/api` və `/uploads` backend-ə proksi olunmalıdır.

## Yekun vəziyyət

- Başladığım bütün proseslər dayandırıldı (backend, yaddaş bazası, Vite dev, Vite preview). 5000, 5173 və 4173 portlarında dinləyən proses yoxdur.
- `client/dist` silindi. `server/uploads/`-da yalnız `.gitkeep` və istifadəçinin faylı qalıb.
- Layihəyə yeni npm paketi əlavə olunmadı. Em dash yazdığım fayllarda yoxdur.
