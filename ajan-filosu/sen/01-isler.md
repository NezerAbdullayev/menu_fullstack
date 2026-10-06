# Sen · yapılacaklar

> Buraya yapılacakları yazıyorsun. Serbest biçim, madde madde.
> **Sıra verme. Bağımlılık yazma.** Onu sistem çözecek, senin işin değil.

## İşler

Her satır bir iş. Ne kadar somut yazarsan plan o kadar doğru çıkar.

- Kötü: "siteyi düzelt"
- İyi: "anasayfadaki fiyat tablosunu mobilde tek sütuna indir"

Sistem belirsiz bir madde görürse sana sorar, tahmin etmez.

Layihə: `../menu-app` (restoran menyu saytı). Backend kodu artıq yazılıb: `../menu-app/server` (Node.js, Express 5, MongoDB/Mongoose 9, JWT, multer, zod). Frontend: React (Vite), React Router, **Ant Design**, i18next (az / en / ru).

```
- Backend API-ni yaddaşda işləyən müvəqqəti MongoDB (mongodb-memory-server, scratchpad-da) ilə uçdan-uca sına: login, bölmə və məhsul CRUD, sıralama, şəkil yükləmə, public menyu. Tapılan xətaları düzəlt.
- Nümunə məlumat skripti yaz: server/src/scripts/seedDemo.js ("Qəlyan", "İçkilər", "Qazan yeməkləri" bölmələri və hər birində 3-4 məhsul, az/en/ru adlarla), server/package.json-a "seed:demo" skripti əlavə et.
- Frontend skeletini qur: ../menu-app/client içində Vite + React, antd, react-router-dom, axios, i18next, react-i18next, i18next-browser-languagedetector. Router (public və /admin marşrutları), Ant Design ConfigProvider (dilə görə locale), i18n (az/en/ru, namespace-lər: common, public, admin), axios instansı (token interceptor), AuthContext, ProtectedRoute, PublicLayout, AdminLayout, dil dəyişmə komponenti, lokallaşdırılmış sahə köməkçisi (name[lang], yoxdursa az). Səhifələr üçün boş stub-lar yarat.
- İstifadəçi menyu səhifələrini Ant Design ilə yaz: bölmələr siyahısı (/), bölmə məhsulları (/menu/:slug), məhsul kartı (şəkil, ad, təsvir, qiymət, "hazırda yoxdur" etiketi). Telefon (1 sütun, üfüqi sürüşən bölmə tab-ları) və kompüter (3-4 sütun) üçün responsiv.
- Admin paneli Ant Design ilə yaz: login səhifəsi, dashboard (statistika), bölmələr (Table + Modal Form, az/en/ru xanaları, aktiv/deaktiv, sıralama, şəkil yükləmə), məhsullar (bölməyə görə filtr, Table + Form, qiymət, mövcudluq, şəkil).
- İnteqrasiya və cilalama: vite proxy (/api və /uploads -> localhost:5000), yüklənmə və xəta halları, boş bölmə, 404 səhifəsi, token vaxtı bitəndə login-ə yönləndirmə, "npm run build" xətasız keçsin. ../menu-app/README.md yaz (necə qurulur, necə işə salınır).
- Real MongoDB-yə qoş: .env-də MONGO_URI yaz, "npm run seed" (admin), "npm run seed:demo", backend + frontend-i birlikdə işə salıb brauzerdə yoxla.
- Deploy: MongoDB Atlas, backend (Render və ya VPS), frontend (Vercel və ya Netlify).
```

## Bu koşuda dokunulmayacaklar (opsiyonel)

Hiçbir çalışanın dokunmasını istemediğin dosya ya da klasörler.

```
- ../menu-app/server/.env (sirlər, yalnız "Real MongoDB" işində, istifadəçinin verdiyi URI ilə dəyişdirilir)
- ../menu-app/server/src/models, routes, controllers (backend testində xəta tapılmasa)
```

## Geri alınamaz işler (opsiyonel ama önemli)

Yukarıdaki listede silme, dışarıya gönderme (mail, post, mesaj), ödeme ya da veri tabanı değiştirme varsa buraya da yaz. Sistem bunları asla paralel dalgaya koymaz, tek tek ve sırayla koşar.

```
- Real MongoDB-yə qoşulma və seed (verilənlər bazasına yazır)
- Deploy (xarici xidmətlərə göndərir, hesab və ödəniş ola bilər)
```

---

## Filo defteri
> Bunu sen doldurmuyorsun. Her koşudan sonra sistem tek satır ders yazar. En değerlisi şudur: paralel sanılıp aslında aynı dosyaya dokunan işler. Sonraki planlar bu defteri okur ve aynı hatayı tekrarlamaz.

Biçim: `TARİH · ders`

```
2026-07-29 · Üç okuma işi paralel koştu, çakışma çıkmadı. Genel kazanç 1,63 kat, dalga 1 içinde 2,2 kat. Ders: kazanç en uzun işin süresine bağlı, iş sayısına değil. Tek işlik dalga eklemek genel oranı düşürüyor; mümkünse dalga 2'ye de iş toplamalı.
```
