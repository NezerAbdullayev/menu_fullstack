# SONUC · 4-admin · Dalğa 2

- Başlama: 2026-09-27 22:07
- Bitmə: 2026-09-27 22:15
- Status: **kod yazıldı, build və lint keçir**. Real backend ilə brauzerdə sınanmayıb (aşağıda "Edə bilmədiklərim").

## Yaradılan / dəyişən fayllar (`menu-app/client/src/`)

Səhifələr (stub-lar tam əvəz olundu):
- `pages/admin/LoginPage.jsx`: mərkəzdə kart, email + parol Form (klient validasiyası), yuxarıda "Sayta qayıt" və `LangSwitcher`. Xətalar `Alert`-də: 401 yanlış email/parol, 429 çox cəhd, 400 yanlış məlumat, şəbəkə xətası `common:networkError`. Artıq daxil olubsa (və uğurlu girişdən sonra) `state.from`-a (yalnız `/admin...` yolları) və ya `/admin`-ə `Navigate`.
- `pages/admin/DashboardPage.jsx`: `useGetStatsQuery` ilə 3 `Statistic` kartı (bölmə, məhsul, mövcud olmayan; kart kliklənəndə müvafiq səhifə), xoş gəldin mətni, sürətli keçid düymələri, "Sayta bax" (`/`, yeni tab). Xətada `ErrorState` + yenidən cəhd.
- `pages/admin/CategoriesPage.jsx`: `Table` (sıra yuxarı/aşağı, miniatür, ad az + kiçik en · ru, slug, məhsul sayı `Tag` (klikdə `/admin/items?category=id`), aktiv `Switch`, redaktə, sil `Popconfirm`). "Bölmə əlavə et". İçində məhsul olan bölmədə Popconfirm xəbərdarlıq göstərir və sil düyməsi deaktivdir, 409 gəlsə tərcümə olunmuş mesaj.
- `pages/admin/ItemsPage.jsx`: bölmə filtri `Select` (URL `?category=` ilə saxlanır, "Bütün bölmələr" + hər bölmədə say), `Table` (sıra, şəkil, ad, bölmə, qiymət `formatPrice`, mövcudluq `Switch`, redaktə/sil). Sıra düymələri yalnız bölmə seçiləndə aktivdir, əks halda ipucu göstərilir. Bölmə yoxdursa "Əlavə et" deaktiv + `Alert`.

Komponentlər (`components/admin/`):
- `ImageUpload.jsx`: kontrollu (`value` url, `onChange(url)`), antd `Upload` + `customRequest` ilə `useUploadImageMutation().unwrap()`, klientdə tip (jpg/png/webp) və 5 MB yoxlaması, önizləmə (`Image`), "Şəkli dəyiş" / "Şəkli sil".
- `LocalizedInputs.jsx`: `name.az/en/ru` kimi sahələr üçün 3 xana (ad üçün masaüstündə yan-yana, mobildə alt-alta; təsvir üçün TextArea). az mütləq ola bilər.
- `CategoryFormModal.jsx`, `ItemFormModal.jsx`: `Modal` (`open`, `destroyOnHidden`, `mask={{closable}}`, `confirmLoading`) + `Form`. Yaratma/yeniləmə mutation-ları içindədir, uğurda `message.success`, xətada serverin `errors[{path}]`-ı form sahələrinə yazılır; bölmədə 409 slug xanasında "slug artıq istifadə olunur".
- `ReorderButtons.jsx`, `Thumb.jsx`: yuxarı/aşağı düymələri, cədvəl miniatürü.
- `formUtils.js`: `toCategoryBody`, `toItemBody` (PUT üçün tam body, `category` populate olunubsa yalnız `_id`, `name/description` həmişə `{az,en,ru}` sətirləri), `applyServerErrors`, `moveId`, `normalizeLocalized`.
- `components/admin/.gitkeep` silindi (qovluq artıq boş deyil).

Tərcümələr: `i18n/locales/{az,en,ru}/admin.json` (login, dashboard, fields, status, validation, reorder, upload, categories, items). İstifadə olunan bütün açarların üç dildə mövcudluğu skriptlə yoxlandı. Ümumi düymələr `common:` namespace-dən (`save`, `cancel`, `edit`, `delete`, `actions`, `nav.*`, `networkError`).

## Əsas qərarlar

1. Məlumat yalnız `apiSlice` hook-ları və `useAuth()` ilə. `fetch`/axios yoxdur. Mutation-lardan sonra əl ilə refetch edilmir (tag-lər yeniləyir).
2. Switch ilə aktiv/mövcudluq dəyişəndə tam obyekt PUT olunur (`toCategoryBody(record, {isActive})`, `toItemBody(record, {isAvailable})`).
3. Sıralama: yerini dəyiş, bütün id-lərin yeni sırası `reorder({type, ids})`. Sorğu və yenidən yükləmə bitənə qədər sıra düymələri deaktivdir (köhnə siyahı ilə ikinci klik olmasın).
4. Yeni bölmənin `order`-i = mövcud max + 1; yeni məhsulun (və ya başqa bölməyə köçənin) `order`-i = həmin bölmənin `itemCount`-u. Beləliklə yeni qeyd siyahının sonuna düşür (backend default 0 ilə başa düşərdi).
5. Məhsullar cədvəli `currentData` istifadə edir: bölmə dəyişəndə köhnə bölmənin məhsulları göstərilmir.
6. Server mesajları yalnız azərbaycancadır, ona görə 401/429/409 kimi məlum hallar üçün klientdə tərcümə olunmuş mətn göstərilir, qalanlarında server mesajı.
7. antd v6 API: `Alert title` və `closable.onClose`, `Modal destroyOnHidden` və `mask.closable`, `Select showSearch={{optionFilterProp}}`, `Card styles.body`, `InputNumber suffix` (addonAfter deyil). Statik `message` yox, `App.useApp()`.
8. Responsiv: cədvəllərdə `scroll.x` (720/760), şəkil sütunu `sm`, slug və bölmə sütunları `md`-dən görünür, əməliyyat sütunu `fixed: 'right'`. Modal antd-nin standart `max-width: calc(100vw - 32px)`-si ilə telefona sığır, `top: 24`. Form xanaları `Col xs=24`.
9. `<a>` içində `<button>` olmasın deyə keçid düymələri `useNavigate` ilə.

## Yoxlama nəticəsi

- `npm run lint` (oxlint): xəta/xəbərdarlıq yoxdur (exit 0).
- `npm run build`: **uğurlu** (3192 modul, JS 1415 kB, gzip 451 kB, xəbərdarlıq yoxdur). Sonra yalnız `dist/` silindi.
- Dev server (5173) qısa müddət işə salındı: bütün admin modulları və `/admin/login`, `/admin` 200 qaytardı. Server dayandırıldı, port 5173 boşdur.
- Em dash yoxlaması: admin fayllarında yoxdur.

## 5-inteqrasiya üçün təkliflər

1. Backend xəta mesajları yalnız azərbaycancadır. İstəsəniz server `code` sahəsi (məs. `SLUG_TAKEN`, `CATEGORY_HAS_ITEMS`) qaytarsın, klient tam tərcümə edə bilsin.
2. `getAdminCategories` `[CATEGORY, ITEM]` tag-ini təmin edir, amma `reorder` `type: 'item'` olanda yalnız `ITEM`-i etibarsız edir, bu kifayətdir. Lakin `uploadImage` heç bir tag etibarsız etmir (düzgündür). Dəyişiklik lazım deyil, yalnız qeyd.
3. `AdminLayout` başlıq çubuğunda səhifə adı yoxdur; mobildə menyu bağlı olanda istifadəçi hansı səhifədə olduğunu yalnız başlıqdan görür (səhifələrdə `Title` var, problem deyil).
4. Bundle 1.4 MB-dır (antd + iki paralel işçinin kodu). İstəsəniz `App.jsx`-də admin səhifələri `React.lazy` ilə ayrı chunk-a çıxarıla bilər (ortaq fayl olduğuna görə toxunmadım).
5. Real backend ilə E2E yoxlama: login, bölmə yarat/redaktə/sil, 409 halları, şəkil yükləmə (proxy `/uploads`), sıralama və mobil görünüş (375 px) brauzerdə yoxlanmalıdır.

## Edə bilmədiklərim

- Brauzerdə real render və React runtime xəbərdarlıqları yoxlanmayıb (yalnız build, lint və modul transformu 200). Backend işə salınmadı (brief bazaya qoşulmağı qadağan edir), ona görə login, CRUD, şəkil yükləmə və sıralama real sorğularla sınanmayıb.
- Drag-and-drop yoxdur (brief-ə uyğun olaraq yalnız yuxarı/aşağı düymələri).
