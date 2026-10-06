# SONUC · 1-backend · Dalğa 1

- Başlama: 2026-09-27 20:37 (AST)
- Bitmə: 2026-09-27 20:44 (AST)
- Vəziyyət: **bitdi**. Bütün testlər yaddaş bazasında keçdi.

## Nə etdim
1. Backend-i yaddaşda işləyən MongoDB (mongodb-memory-server, mongod 8.2.6) ilə uçdan-uca sınadım. Real Atlas bazasına qoşulmadım, `.env` oxunmadı və dəyişdirilmədi, `npm run seed:demo` işlədilmədi. Testlər `MONGO_URI` mühit dəyişəni silinmiş halda işlədi, test skripti URI-nin `mongodb://127.0.0.1` ilə başladığını yoxlayır.
2. 3 real xəta tapıb düzəltdim (aşağıda), üstəlik 1 kiçik möhkəmlik düzəlişi.
3. `src/scripts/seedDemo.js` yazdım və `package.json` `scripts` bölməsinə `seed:demo` əlavə etdim. Yeni asılılıq yoxdur.

## Test nəticələri
Test faylları scratchpad-dadır: `scratchpad/apitest/test.mjs`, `full.mjs`, `seedtest.mjs`.

| Test | Düzəlişdən əvvəl | Düzəlişdən sonra |
|---|---|---|
| `test.mjs` (hazır skript) | 23 keçdi, 0 keçmədi | 23 keçdi, 0 keçmədi |
| `full.mjs`, cwd = server | 97 keçdi, 3 keçmədi | 102 keçdi, 0 keçmədi |
| `full.mjs`, cwd = başqa qovluq | 96 keçdi, 4 keçmədi | 102 keçdi, 0 keçmədi |
| `seedtest.mjs` | yoxdur | 13 keçdi, 0 keçmədi |

(`full.mjs`-ə sonradan 2 yoxlama əlavə olundu: 1 MB-dan böyük JSON -> 413 və CORS, ona görə say 100-dən 102-yə qalxıb.)

`full.mjs` bunları əhatə edir: health; token yoxdur / etibarsız token 401; yanlış parol, olmayan email 401; yanlış email formatı və `{ $ne: null }` injection cəhdi 400; böyük hərf və boşluqlu email ilə login 200; `/auth/me`; pozulmuş JSON 400; 1 MB+ JSON 413; CORS başlığı; bölmə CRUD (slug: qelyan, qazan-yemekleri, ickiler, xüsusi slug), dublikat slug 409 (create və update), boş/yalnız simvol adı 400, kəsr `order` 400, olmayan ID 404, yanlış ID 400; məhsul CRUD, mənfi/boş qiymət 400, olmayan bölmə 400, qiymət coerce, description default; `?category=` filtri və sıralama, populate; stats sayları; `itemCount`; məhsulu olan bölməni silmə 409; bölmə və məhsul reorder və nəticə sırası, yanlış reorder 400; deaktiv bölmənin `/menu`, `/categories` və `/categories/:slug/items`-dən gizlənməsi; naməlum route 404; public route-dan admin əməliyyatı 401; şəkil yükləmə (png 201 və statik fayl `image/png` ilə 200, txt 400, faylsız 400, 5 MB+ 400); şəkil dəyişəndə və məhsul/bölmə silinəndə köhnə faylın silinməsi; login rate limit 429. Testdən sonra `server/uploads/` içində yalnız `.gitkeep` qalıb.

## Tapılan və düzəldilən xətalar
1. **Pozulmuş JSON 500 qaytarırdı** · `server/src/middleware/errorHandler.js:23-28`. `express.json()` xətası (`entity.parse.failed`, status 400) və ya 1 MB limiti (`entity.too.large`, 413) errorHandler-də tanınmırdı, ona görə "Server xətası" 500 qaytarılır və konsola stack yazılırdı. İndi `err.status` 4xx olarsa həmin status və anlaşılan mesaj qaytarılır.
2. **Saxlanan XSS: fayl genişləməsi istifadəçinin fayl adından götürülürdü** · `server/src/middleware/upload.js:5-13`. MIME tipi (`image/png`) müştəridən gəlir, genişləmə isə `originalname`-dən. `evil.html` adlı, `image/png` kimi göndərilən fayl `.html` kimi saxlanır və `/uploads/...html` ünvanından `text/html` olaraq, serverin öz origin-indən verilirdi (testdə sübut olundu). İndi genişləmə yalnız icazəli MIME tipindən təyin olunur (`.jpg/.png/.webp`), yoxlama `Object.hasOwn` ilə.
3. **uploads qovluğu prosesin cari qovluğuna bağlı idi** · `server/src/utils/files.js:6`, `server/src/middleware/upload.js:11`, `server/src/app.js:8,16`. `'uploads/'` nisbi yol idi: server `menu-app/server`-dən başqa qovluqdan işə salınsa (məs. `node server/src/index.js`, PM2, hostinq), fayllar başqa yerə yazılır, statik fayl və silmə də oradan işləyirdi (testdə scratchpad-da yeni `uploads` qovluğu yarandı). İndi `UPLOAD_DIR` `import.meta.url`-dan hesablanır və həmişə `server/uploads/`-dur; multer, `express.static` və `removeUpload` eyni sabiti işlədir.
4. Kiçik: `server/src/app.js:14` `CLIENT_URL` vergüllə bölünəndə boşluqlar kəsilir (`a, b` yazılsa ikinci origin işləmirdi).

## seedDemo.js
- Fayl: `menu-app/server/src/scripts/seedDemo.js`. Bölmələr: Qəlyan (3 məhsul), İçkilər (4), Qazan yeməkləri (3). Ad və təsvir az/en/ru, qiymət AZN, şəkil yoxdur.
- Bölmə `slug`-a görə (`findOneAndUpdate` + upsert), məhsul `category + name.az`-a görə (`updateOne` + upsert). Ad, təsvir, qiymət hər dəfə yenilənir; `order`, `isActive`, `isAvailable` yalnız ilk yaradılışda yazılır ki, admin paneldəki sıra və gizlətmə təkrar işlətmədə pozulmasın.
- `MONGO_URI` yoxdursa exit 1. `connectDB` ilə qoşulur, sonda `finally` içində `mongoose.disconnect()`.
- Necə sınandı (`seedtest.mjs`): skript ayrıca node prosesində, `--env-file` OLMADAN, `MONGO_URI` yaddaş bazasına yönəldilərək 3 dəfə işlədildi. 1-ci işlətmə: 3 bölmə, 10 məhsul. Arada admin dəyişikliyi (Qəlyan deaktiv, order=9, əl ilə 1 məhsul). 2-ci və 3-cü işlətmə: yenə 3 bölmə, 11 məhsul, mövcud `_id`-lər dəyişmədi, deaktivlik və sıra qorundu. Mongoose `new` köhnəlmə xəbərdarlığı `returnDocument: 'after'` ilə aradan qaldırıldı.
- `package.json`: `"seed:demo": "node --env-file=.env src/scripts/seedDemo.js"`.

## Edə bilmədiklərim / qeydlər
- Real Atlas bazasında seed işlədilmədi (qadağandır). İstifadəçi özü `npm run seed:demo` işlətməlidir.
- Bir məhsulun şəkli başqa məhsulda da istifadə olunursa, birini silmək/dəyişmək faylı silir və digərində şəkil qırılır. Nadir halda olduğu üçün toxunmadım.
- Rate limiter `trust proxy` olmadan işləyir. Proksi (Render, Nginx) arxasında bütün istifadəçilər bir IP sayıla bilər. Deploy mühiti məlum olmadığı üçün dəyişmədim.
- `menu-app/client/`-ə toxunulmadı.
