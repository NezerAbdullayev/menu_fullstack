# BRIEF · 5-inteqrasiya · Dalğa 3 (tək)

## İş
Frontend və backend-i birlikdə uçdan-uca sına, tapılan xətaları düzəlt, admin səhifələrini lazy load et, kiçik cilalama et, `menu-app/README.md` yaz.

## Kontekst
- Layihə: `C:\Users\nazar.abdullayev\Desktop\menu\menu-app` (`server/`: Express 5 + Mongoose 9; `client/`: React 19.3, antd 6.6, RTK Query, react-router 7, i18next).
- Əvvəlki hesabatlar (oxu): `ajan-filosu/isler/{1-backend,2-skelet,2b-rtk,3-public,4-admin}/SONUC.md`. Onlardakı "5-inteqrasiya üçün təkliflər" bölmələrinə bax.
- **İstifadəçi hər iki hissəni (müştəri menyusu və admin panel) real bazada əl ilə sınayıb, əsas axınlar işləyir.** Sənin işin kənar halları, xəta hallarını, mobil görünüşü və keyfiyyəti yoxlamaqdır.
- Kod dili: Azərbaycan dilində şərhlər, mövcud üsluba uyğun.

## Test mühiti (MÜTLƏQ)
- **Real Atlas bazasına qoşulma. `server/.env`-ə toxunma və onu işə salma üçün istifadə etmə** (`npm run dev` / `npm start` / `npm run seed*` `.env` ilə Atlas-a qoşulur, istifadə etmə).
- Test üçün backend-i yaddaş bazası ilə işə sal: scratchpad-da `C:\Users\NAZAR~1.ABD\AppData\Local\Temp\claude\C--Users-nazar-abdullayev-Desktop-menu\9534365b-24bc-4740-be44-bf95f1789d4b\scratchpad\apitest\` qovluğunda `mongodb-memory-server` quraşdırılıb (`test.mjs`, `full.mjs`, `seedtest.mjs` nümunədir). Orada skript yaz: yaddaş bazası yarat, `server/src/app.js`-i import et, `JWT_SECRET` və `CLIENT_URL`-i `process.env`-də təyin et, admin yarat (`admin@menu.az` / `Admin12345`), demo məlumatı yüklə (`seedDemo.js`-i yaddaş bazasının `MONGO_URI`-si ilə ayrıca prosesdə işlət və ya eyni məntiqi təkrarla), `app.listen(5000)`. Vite dev (`client`, port 5173) proxy ilə ona qoşulacaq.
- Brauzer testi: `claude-in-chrome` skill-i əlçatandırsa istifadə edə bilərsən. Yoxdursa, **Playwright-ı yalnız scratchpad-da** quraşdır (layihəyə yox) və Chromium ilə skriptlə sına: ekran şəkilləri (360/375px və 1280px), konsol xətaları, axınlar.
- Test zamanı yüklənən şəkillər `server/uploads/`-a düşür: testdən sonra yalnız öz yüklədiklərini sil, `.gitkeep` qalsın. İstifadəçinin real yüklədiyi faylları silmə (test başlamazdan əvvəl qovluqda olanları qeyd et və onlara toxunma).
- Sonda bütün prosesləri dayandır, 5000 və 5173 portları boş qalsın.

## Nə etməli
1. **Uçdan-uca yoxlama** (brauzerdə):
   - Müştəri: `/`, `/menu/:slug`, çiplər arası keçid, deaktiv bölmənin görünməməsi, "Hazırda yoxdur", 404 bölmə, bilinməyən səhifə, dil dəyişmə (az/en/ru), 360px-də üfüqi scroll olmaması.
   - Admin: login (yanlış/düzgün), token olmadan `/admin` → login, səhifə yenilənəndə sessiyanın qalması, çıxış, bölmə CRUD, slug 409, məhsulu olan bölmənin silinməsi 409, məhsul CRUD, şəkil yükləmə və dəyişmə (köhnə faylın silinməsi), sıralama, aktiv/mövcud switch-ləri, mutation-dan sonra siyahı və statistikanın avtomatik yenilənməsi, mobil görünüş.
   - Konsol xətaları və React/antd xəbərdarlıqları (məs. köhnəlmiş prop-lar).
2. **Tapılan xətaları düzəlt** (hər birini SONUC-da fayl:sətir və səbəb ilə yaz).
3. **Lazy load:** `App.jsx`-də admin səhifələrini (`LoginPage` daxil) `React.lazy` + `Suspense` (fallback `Loading`) ilə ayrı chunk-a çıxar. Müştəri menyusunun ilk yüklənən JS həcmini əvvəl/sonra müqayisə et. Lazım olsa `vite.config.js`-də `chunkSizeWarningLimit`-i yenidən dəyərləndir.
4. **Kiçik cilalama:** `PageState.jsx`-də `Loading` prop-u `tip` → `description` (istifadə yerlərini də yenilə). Digər işçilərin təkliflərindən məntiqli və kiçik olanları et, böyükləri SONUC-a yaz.
5. **Server xəta mesajlarının tərcüməsi: BU DALĞADA EDİLMİR** (istifadəçi qərarı gözlənilir). Yalnız SONUC-da qeyd et.
6. **`menu-app/README.md`** (Azərbaycan dilində): layihənin təsviri, texnologiyalar, qovluq quruluşu, tələblər (Node 24, MongoDB/Atlas), `.env` dəyişənləri (`server/.env.example`-a istinad, real dəyərləri YAZMA), quraşdırma, `npm run seed` (admin), `npm run seed:demo`, backend və frontend-i işə salma, telefonda sınama (`npm run dev -- --host`), build, API endpoint-lərinin qısa siyahısı.
7. `npm run build` və `npm run lint` (client) xətasız keçməlidir, sonra `dist`-i sil.

## YAZA BİLƏCƏYİN yerlər
- `menu-app/client/**` (package.json-a yeni asılılıq ƏLAVƏ ETMƏ)
- `menu-app/server/src/**` yalnız real xəta düzəlişi üçün (asılılıq əlavə etmə)
- `menu-app/README.md`
- `menu-app/server/uploads/` yalnız test faylları (sonda sil)
- scratchpad
- `ajan-filosu/isler/5-inteqrasiya/SONUC.md` (və istəsən ekran şəkilləri `ajan-filosu/isler/5-inteqrasiya/` içində)

## QADAĞALAR
- `server/.env`, Atlas bazası, `npm run seed` / `seed:demo`-nun `.env` ilə işlədilməsi.
- Layihəyə yeni npm paketi (Playwright yalnız scratchpad-da).
- İstifadəçinin `server/uploads/`-dakı mövcud faylları.
- Em dash (uzun tire).

## Bitəndə
`ajan-filosu/isler/5-inteqrasiya/SONUC.md` (Azərbaycan dilində): başlama/bitmə vaxtı, necə sınadın (mühit, alət), keçən və keçməyən yoxlamalar, tapılıb düzəldilən xətalar (fayl:sətir), lazy load nəticəsi (KB əvvəl/sonra), README, edilməyənlər və deploy üçün qeydlər. Uydurma "bitdi" yazma.
