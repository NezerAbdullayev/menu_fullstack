// Nümunə menyu: 3 bölmə, hər birində bir neçə məhsul (az/en/ru), qiymət AZN, şəkilsiz.
// Təkrar işlədiləndə dublikat yaratmır:
//   bölmə slug-a görə, məhsul (bölmə + az adı) cütünə görə upsert olunur.
// Mətn və qiymət hər dəfə yenilənir; sıra, aktivlik və mövcudluq yalnız ilk yaradılışda
// yazılır ki, admin paneldə edilən dəyişikliklər təkrar işlətmədə pozulmasın.
// İşlətmə: npm run seed:demo
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';
import { slugify } from '../utils/slugify.js';

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.error('.env faylında MONGO_URI yazın');
  process.exit(1);
}

const t = (az, en, ru) => ({ az, en, ru });

const DEMO = [
  {
    name: t('Qəlyan', 'Hookah', 'Кальян'),
    items: [
      {
        name: t('Klassik qəlyan', 'Classic hookah', 'Классический кальян'),
        description: t('Alma və nanə ətirli klassik qəlyan', 'Classic hookah with apple and mint flavor', 'Классический кальян со вкусом яблока и мяты'),
        price: 30,
      },
      {
        name: t('Meyvəli qəlyan', 'Fruit hookah', 'Фруктовый кальян'),
        description: t('Ananas və ya qreypfrut üzərində qəlyan', 'Hookah served on a pineapple or grapefruit', 'Кальян на ананасе или грейпфруте'),
        price: 45,
      },
      {
        name: t('Premium qəlyan', 'Premium hookah', 'Премиум кальян'),
        description: t('Seçilmiş tütün qarışığı ilə premium qəlyan', 'Premium hookah with a selected tobacco blend', 'Премиум кальян с отборной табачной смесью'),
        price: 60,
      },
    ],
  },
  {
    name: t('İçkilər', 'Drinks', 'Напитки'),
    items: [
      {
        name: t('Armudu stəkanda çay', 'Tea in armudu glass', 'Чай в армуду'),
        description: t('Limon və mürəbbə ilə qara çay', 'Black tea served with lemon and jam', 'Чёрный чай с лимоном и вареньем'),
        price: 3,
      },
      {
        name: t('Ayran', 'Ayran', 'Айран'),
        description: t('Soyuq, təzə ayran', 'Cold fresh yogurt drink', 'Холодный свежий айран'),
        price: 2.5,
      },
      {
        name: t('Limonad', 'Lemonade', 'Лимонад'),
        description: t('Ev üsulu nanəli limonad', 'Homemade lemonade with mint', 'Домашний лимонад с мятой'),
        price: 5,
      },
      {
        name: t('Türk qəhvəsi', 'Turkish coffee', 'Турецкий кофе'),
        description: t('Cəzvədə dəmlənmiş qəhvə', 'Coffee brewed in a cezve', 'Кофе, сваренный в джезве'),
        price: 4,
      },
    ],
  },
  {
    name: t('Qazan yeməkləri', 'Cauldron dishes', 'Блюда из казана'),
    items: [
      {
        name: t('Şah plov', 'Shah pilaf', 'Шах плов'),
        description: t('Lavaş içində bişmiş, quru meyvəli plov', 'Pilaf baked in lavash with dried fruits', 'Плов, запечённый в лаваше, с сухофруктами'),
        price: 25,
      },
      {
        name: t('Qazan kababı', 'Cauldron kebab', 'Казан кебаб'),
        description: t('Qazanda qızardılmış quzu əti və kartof', 'Lamb and potatoes fried in a cauldron', 'Баранина с картофелем, обжаренные в казане'),
        price: 18,
      },
      {
        name: t('Toyuq çığırtması', 'Chicken chygyrtma', 'Чыгыртма из курицы'),
        description: t('Pomidor və yumurta ilə toyuq', 'Chicken with tomatoes and eggs', 'Курица с помидорами и яйцами'),
        price: 12,
      },
    ],
  },
];

await connectDB(MONGO_URI);

try {
  let catCount = 0;
  let itemCount = 0;

  for (const [catIndex, cat] of DEMO.entries()) {
    const slug = slugify(cat.name.az);
    const category = await Category.findOneAndUpdate(
      { slug },
      { $set: { name: cat.name }, $setOnInsert: { slug, order: catIndex, isActive: true } },
      { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true }
    );
    catCount++;

    for (const [itemIndex, item] of cat.items.entries()) {
      await MenuItem.updateOne(
        { category: category._id, 'name.az': item.name.az },
        {
          $set: { name: item.name, description: item.description, price: item.price },
          $setOnInsert: { category: category._id, order: itemIndex, isAvailable: true },
        },
        { upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
      itemCount++;
    }
    console.log(`Bölmə hazırdır: ${cat.name.az} (${slug}), ${cat.items.length} məhsul`);
  }

  console.log(`Nümunə məlumat yazıldı: ${catCount} bölmə, ${itemCount} məhsul`);
} finally {
  await mongoose.disconnect();
}
