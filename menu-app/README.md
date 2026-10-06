# Menyu

Restoran və kafe üçün QR menyu. Müştəri telefonda menyunu açır, bölmələrə baxır, məhsulların şəklini, təsvirini və qiymətini görür. Admin paneldən bölmə və məhsullar idarə olunur: əlavə, redaktə, silmə, sıralama, şəkil yükləmə, gizlətmə və "hazırda yoxdur" işarəsi. Məzmun üç dildədir: azərbaycan (əsas), ingilis və rus.

## Texnologiyalar

| Hissə | Texnologiya |
|---|---|
| Backend | Node.js 24, Express 5, Mongoose 9 (MongoDB), JWT, bcryptjs, zod, multer, helmet, express-rate-limit |
| Frontend | React 19, Vite 8, Ant Design 6, Redux Toolkit + RTK Query, React Router 7, i18next |
| Baza | MongoDB (lokal və ya MongoDB Atlas) |

## Qovluq quruluşu

```
menu-app/
├── server/                  Backend (Express API)
│   ├── src/
│   │   ├── app.js           Express tətbiqi (middleware, route-lar)
│   │   ├── index.js         Başlanğıc: bazaya qoşulur, portu dinləyir
│   │   ├── config/          MongoDB qoşulması
│   │   ├── controllers/     Route məntiqi (public, auth, bölmə, məhsul, admin)
│   │   ├── middleware/      auth (JWT), validate (zod), upload (multer), errorHandler
│   │   ├── models/          Admin, Category, MenuItem
│   │   ├── routes/          /api, /api/auth, /api/admin
│   │   ├── scripts/         seedAdmin.js, seedDemo.js
│   │   ├── utils/           slugify, fayl silmə
│   │   └── validators/      zod sxemləri
│   ├── uploads/             Yüklənən şəkillər (gitə düşmür)
│   └── .env.example         Mühit dəyişənləri nümunəsi
└── client/                  Frontend (Vite + React)
    ├── src/
    │   ├── app/store.js     Redux store
    │   ├── features/        RTK Query API (apiSlice), auth slice
    │   ├── pages/public/    Müştəri menyusu: /, /menu/:slug
    │   ├── pages/admin/     Admin: login, dashboard, bölmələr, məhsullar (lazy yüklənir)
    │   ├── components/      Ortaq, public və admin komponentləri
    │   ├── layouts/         PublicLayout, AdminLayout
    │   └── i18n/            az, en, ru tərcümələri
    └── vite.config.js       Port 5173, /api və /uploads proxy -> localhost:5000
```

## Tələblər

- Node.js 24 (backend `node --env-file` və `node --watch` istifadə edir)
- MongoDB: lokal server (məs. `mongodb://127.0.0.1:27017/menu`) və ya MongoDB Atlas klasteri

## Mühit dəyişənləri (`server/.env`)

`server/.env.example` faylını `server/.env` adı ilə kopyalayın və dəyərləri öz mühitinizə görə doldurun. `.env` gitə əlavə olunmur, real parol və açarları heç yerdə paylaşmayın.

| Dəyişən | Təsvir |
|---|---|
| `PORT` | Backend portu (default 5000) |
| `MONGO_URI` | MongoDB qoşulma sətri (lokal və ya Atlas) |
| `JWT_SECRET` | JWT imzası üçün uzun, təsadüfi sətir (mütləq) |
| `JWT_EXPIRES_IN` | Tokenin ömrü, məs. `7d` |
| `CLIENT_URL` | CORS üçün frontend ünvanı, bir neçəsi vergüllə (`http://localhost:5173,https://menu.example.az`) |
| `ADMIN_EMAIL` | `npm run seed` ilə yaradılacaq admin email-i |
| `ADMIN_PASSWORD` | Həmin adminin parolu (güclü parol seçin) |

## Quraşdırma

```bash
cd menu-app/server
npm install
cp .env.example .env      # sonra .env-i redaktə edin

cd ../client
npm install
```

## Baza: admin və nümunə məlumat

```bash
cd menu-app/server
npm run seed        # .env-dəki ADMIN_EMAIL / ADMIN_PASSWORD ilə admin yaradır və ya parolunu yeniləyir
npm run seed:demo   # nümunə menyu: 3 bölmə (Qəlyan, İçkilər, Qazan yeməkləri), 10 məhsul
```

`seed:demo` təkrar işlədilə bilər: dublikat yaratmır, mətn və qiymətləri yeniləyir, admin paneldə dəyişdirilmiş sıra, aktivlik və mövcudluğa toxunmur. Hər iki skript `.env`-dəki `MONGO_URI` bazasına yazır, işlətməzdən əvvəl hansı bazaya qoşulduğunuzu yoxlayın.

## İşə salma (inkişaf)

İki terminal lazımdır:

```bash
# 1. Backend: http://localhost:5000
cd menu-app/server
npm run dev         # dəyişikliklərdə avtomatik yenidən başlayır (npm start: watch-sız)

# 2. Frontend: http://localhost:5173
cd menu-app/client
npm run dev
```

- Müştəri menyusu: http://localhost:5173/
- Admin panel: http://localhost:5173/admin (giriş: `/admin/login`)

Vite `/api` və `/uploads` sorğularını backend-ə (5000) yönləndirir, ona görə frontend-də əlavə ayar lazım deyil.

## Telefonda sınama

Kompüter və telefon eyni Wi-Fi şəbəkəsində olmalıdır.

```bash
cd menu-app/client
npm run dev -- --host
```

Vite `Network: http://192.168.x.x:5173/` ünvanını göstərir, onu telefonda açın. Backend-ə sorğular Vite proxy-si ilə getdiyi üçün `CLIENT_URL`-i dəyişmək lazım deyil. Windows firewall 5173 portunu soruşarsa, özəl şəbəkə üçün icazə verin.

## Build

```bash
cd menu-app/client
npm run build       # nəticə: client/dist
npm run preview     # build-i lokal yoxlamaq üçün (http://localhost:4173, eyni proxy ilə)
npm run lint        # oxlint
```

Admin səhifələri `React.lazy` ilə ayrı chunk-lara bölünüb: müştəri menyunu açanda admin kodu yüklənmir.

Production-da `client/dist` statik fayl kimi verilir (Nginx, Netlify, Vercel və s.), `/api` və `/uploads` isə backend-ə yönləndirilməlidir. SPA olduğu üçün naməlum yollar `index.html`-ə düşməlidir.

## API

Bütün cavablar JSON-dur. Xəta formatı: `{ message, errors? }`. Admin route-ları `Authorization: Bearer <token>` başlığı tələb edir.

### Public

| Metod | Yol | Təsvir |
|---|---|---|
| GET | `/api/health` | Server işləyirmi |
| GET | `/api/menu` | Aktiv bölmələr və onların məhsulları bir sorğuda |
| GET | `/api/categories` | Aktiv bölmələr (sıra ilə) |
| GET | `/api/categories/:slug/items` | `{ category, items }`; bölmə yoxdursa və ya gizlidirsə 404 |
| GET | `/uploads/:file` | Yüklənmiş şəkil |

### Auth

| Metod | Yol | Təsvir |
|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` -> `{ token, admin }`; 15 dəqiqədə 10 cəhd limiti (429) |
| GET | `/api/auth/me` | Tokenin sahibi olan admin |

### Admin

| Metod | Yol | Təsvir |
|---|---|---|
| GET | `/api/admin/stats` | `{ categories, items, unavailable }` |
| GET | `/api/admin/categories` | Bütün bölmələr, `itemCount` ilə |
| GET | `/api/admin/categories/:id` | Bir bölmə |
| POST | `/api/admin/categories` | Yeni bölmə; slug boşdursa az adından yaranır; eyni slug 409 |
| PUT | `/api/admin/categories/:id` | Bölməni yenilə (tam obyekt); şəkil dəyişibsə köhnə fayl silinir |
| DELETE | `/api/admin/categories/:id` | Bölməni sil; içində məhsul varsa 409 |
| GET | `/api/admin/items?category=<id>` | Məhsullar (istəyə görə bölməyə görə filtr) |
| GET | `/api/admin/items/:id` | Bir məhsul |
| POST | `/api/admin/items` | Yeni məhsul |
| PUT | `/api/admin/items/:id` | Məhsulu yenilə (tam obyekt); köhnə şəkil silinir |
| DELETE | `/api/admin/items/:id` | Məhsulu və şəklini sil |
| PATCH | `/api/admin/reorder` | `{ type: 'category' \| 'item', ids: [...] }` sırası ilə `order` yazılır |
| POST | `/api/admin/upload` | `multipart/form-data`, sahə `image` (JPG/PNG/WEBP, ən çox 5 MB) -> `{ url }` |
