# BRIEF · 1-backend · Dalğa 1

## İş
Backend API-ni yaddaşda işləyən müvəqqəti MongoDB ilə uçdan-uca sına, tapılan xətaları düzəlt, nümunə məlumat skripti (`seedDemo.js`) yaz.

## Kontekst
- Backend: `C:\Users\nazar.abdullayev\Desktop\menu\menu-app\server` (Node 24, ESM, Express 5, Mongoose 9, zod 4, multer 2, JWT).
- Endpoint-lər: `src/routes/public.js`, `src/routes/auth.js`, `src/routes/admin.js`. Modellər: `src/models/`.
- Hazır test skripti: `C:\Users\NAZAR~1.ABD\AppData\Local\Temp\claude\C--Users-nazar-abdullayev-Desktop-menu\9534365b-24bc-4740-be44-bf95f1789d4b\scratchpad\apitest\test.mjs` (həmin qovluqda `mongodb-memory-server` quraşdırılıb). Onu işlət, lazım olsa genişləndir.

## Girdi
`menu-app/server/src/**` (oxuma).

## Çıxış
1. Bütün endpoint-lərin test nəticəsi (login, bölmə və məhsul CRUD, validasiya xətaları, 409 halları, sıralama, şəkil yükləmə və statik fayl, public menyu, deaktiv bölmənin gizlənməsi).
2. `menu-app/server/src/scripts/seedDemo.js`: "Qəlyan", "İçkilər", "Qazan yeməkləri" bölmələri, hər birində 3-4 məhsul, ad və təsvir az/en/ru dillərində, qiymət AZN ilə, şəkilsiz. **Təkrar işlədiləndə dublikat yaratmamalıdır** (bölmə slug-a görə, məhsul bölmə + az adına görə upsert). `connectDB` və `.env`-dəki `MONGO_URI` ilə işləyir, sonda `mongoose.disconnect()`.
3. `menu-app/server/package.json`-a `"seed:demo": "node --env-file=.env src/scripts/seedDemo.js"` skripti.

## YAZA BİLƏCƏYİN yerlər (yalnız bunlar)
- `menu-app/server/src/scripts/seedDemo.js`
- `menu-app/server/package.json` (yalnız `scripts` bölməsinə `seed:demo` əlavə et, asılılıq ƏLAVƏ ETMƏ)
- xəta tapılarsa: `menu-app/server/src/**` (düzəlişin səbəbini SONUC-da yaz)
- scratchpad qovluğu (test faylları)
- `menu-app/server/uploads/` yalnız test zamanı müvəqqəti fayl, testdən sonra sil
- `ajan-filosu/isler/1-backend/SONUC.md`

## QADAĞALAR
- `menu-app/server/.env` faylına toxunma. İçindəki `MONGO_URI` **real Atlas bazasıdır**.
- Real Atlas bazasına qoşulma. `seedDemo.js`-i yalnız yaddaş bazasında sına (məs. `MONGO_URI`-ni mühit dəyişəni ilə yaddaş bazasına yönəldib), heç vaxt `npm run seed:demo`-nu `.env` ilə işlətmə.
- `menu-app/client/`-ə toxunma (başqa işçi orada işləyir).
- `server/package.json`-a yeni paket əlavə etmə.
- Em dash (uzun tire) istifadə etmə.

## Bitəndə
`ajan-filosu/isler/1-backend/SONUC.md` yaz: nə etdin, hansı testlər keçdi/keçmədi (say ilə), hansı xətaları tapıb düzəltdin (fayl:sətir), seedDemo necə sınandı, nəyi edə bilmədin. Uydurma "bitdi" yazma. Başlama və bitmə vaxtını da yaz.
