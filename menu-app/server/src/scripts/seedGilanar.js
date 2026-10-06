// Böyük nümunə menyu: 10 bölmə × 15 məhsul (az/en/ru), qiymət AZN, real şəkillərlə.
// Ad və qiymətlərin bir hissəsi Gilanar Lounge menyusundan götürülüb (yalnız demo/test üçün).
// Şəkillər Wikimedia Commons-dan axtarılıb uploads/ qovluğuna seed-<slug>.jpg adı ilə yüklənir.
// Fayl artıq varsa yenidən yüklənmir. Təkrar işlətmə dublikat yaratmır (seedDemo.js kimi upsert).
// Mövcud bölmə və məhsullara toxunmur.
// İşlətmə: npm run seed:gilanar
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';
import { slugify } from '../utils/slugify.js';
import { UPLOAD_DIR } from '../utils/files.js';

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.error('.env faylında MONGO_URI yazın');
  process.exit(1);
}

const USER_AGENT = 'menu-app-seed/1.0 (demo data)';
const ORDER_START = 10;

const t = (az, en, ru) => ({ az, en, ru });
// [az, en, ru, qiymət, [təsvir az, en, ru], şəkil axtarışı (yoxdursa en adı)]
const i = (az, en, ru, price, d, q) => ({
  name: t(az, en, ru),
  description: t(...d),
  price,
  query: q || en,
});

const MENU = [
  {
    name: t('Səhər yeməyi', 'Breakfast', 'Завтрак'),
    items: [
      i('Pomidor-yumurta', 'Tomato and eggs', 'Помидоры с яйцом', 6, ['Pomidorda bişmiş yumurta', 'Eggs cooked in tomatoes', 'Яйца, тушённые в помидорах'], 'shakshuka'),
      i('Kükü', 'Kuku', 'Кюкю', 6, ['Göyərtili yumurta küküsü', 'Herb and egg frittata', 'Яичный кюкю с зеленью'], 'kuku sabzi'),
      i('Qlazok', 'Fried eggs', 'Глазунья', 4, ['Yağda qızardılmış yumurta', 'Sunny-side-up eggs', 'Яичница-глазунья'], 'fried eggs sunny side up'),
      i('Sadə omlet', 'Plain omelette', 'Простой омлет', 4, ['Yumşaq, klassik omlet', 'Soft classic omelette', 'Нежный классический омлет'], 'omelette'),
      i('Göbələkli omlet', 'Mushroom omelette', 'Омлет с грибами', 6, ['Göbələk ilə omlet', 'Omelette with mushrooms', 'Омлет с шампиньонами'], 'mushroom omelette'),
      i('Pendirli omlet', 'Cheese omelette', 'Омлет с сыром', 6, ['Əridilmiş pendir ilə omlet', 'Omelette with melted cheese', 'Омлет с плавленым сыром'], 'cheese omelette'),
      i('Bal', 'Honey', 'Мёд', 5, ['Təbii dağ balı', 'Natural mountain honey', 'Натуральный горный мёд'], 'honey bowl'),
      i('Pomidor xiyar', 'Tomato and cucumber', 'Помидоры и огурцы', 3, ['Təzə doğranmış tərəvəz', 'Freshly sliced vegetables', 'Свежие нарезанные овощи'], 'sliced tomato cucumber'),
      i('Qaymaq', 'Clotted cream', 'Каймак', 5, ['Kənd qaymağı, çörək ilə', 'Village cream with bread', 'Деревенский каймак с хлебом'], 'kaymak'),
      i('Sosiskalı yumurta', 'Eggs with sausages', 'Яйца с сосисками', 6, ['Qızardılmış sosiska və yumurta', 'Fried sausages and eggs', 'Жареные сосиски с яйцом'], 'eggs and sausages breakfast'),
      i('Sırnıki', 'Syrniki', 'Сырники', 7, ['Xama ilə kəsmik blinçikləri', 'Cottage cheese pancakes with sour cream', 'Творожные сырники со сметаной'], 'syrniki'),
      i('Blinçik', 'Crepes', 'Блинчики', 6, ['Bal və ya mürəbbə ilə', 'With honey or jam', 'С мёдом или вареньем'], 'crepes'),
      i('Sıyıq', 'Oatmeal', 'Овсяная каша', 5, ['Südlü yulaf sıyığı', 'Oatmeal cooked in milk', 'Овсянка на молоке'], 'oatmeal porridge'),
      i('Avokado tost', 'Avocado toast', 'Тост с авокадо', 8, ['Avokado və yumurta ilə tost', 'Toast with avocado and egg', 'Тост с авокадо и яйцом']),
      i('Kənd səhər yeməyi', 'Village breakfast', 'Деревенский завтрак', 15, ['Pendir, qaymaq, bal, yumurta, çay', 'Cheese, cream, honey, eggs, tea', 'Сыр, каймак, мёд, яйца, чай'], 'turkish breakfast'),
    ],
  },
  {
    name: t('Soyuq qəlyanaltılar', 'Cold appetizers', 'Холодные закуски'),
    items: [
      i('Ağ pendir', 'White cheese', 'Белый сыр', 5, ['Duzlu ağ pendir', 'Salted white cheese', 'Солёный белый сыр'], 'feta cheese'),
      i('Pendir assorti', 'Cheese platter', 'Сырная тарелка', 8, ['Müxtəlif pendir çeşidləri', 'Assorted cheeses', 'Ассорти сыров']),
      i('Turşu assorti', 'Pickle platter', 'Ассорти соленьев', 8, ['Ev turşuları', 'Homemade pickles', 'Домашние соленья'], 'pickles'),
      i('Tərəvəz buketi', 'Vegetable platter', 'Овощная тарелка', 5, ['Təzə mövsüm tərəvəzləri', 'Fresh seasonal vegetables', 'Свежие сезонные овощи']),
      i('Zeytun assorti', 'Olive platter', 'Ассорти оливок', 6, ['Yaşıl və qara zeytun', 'Green and black olives', 'Зелёные и чёрные оливки'], 'olives bowl'),
      i('Göyərti', 'Fresh herbs', 'Зелень', 2, ['Təzə göyərti dəstəsi', 'Bunch of fresh herbs', 'Пучок свежей зелени'], 'fresh herbs parsley dill'),
      i('Ət assorti', 'Cold cuts platter', 'Мясное ассорти', 14, ['Hisə verilmiş ət çeşidləri', 'Assorted cured meats', 'Ассорти копчёного мяса'], 'charcuterie'),
      i('Humus', 'Hummus', 'Хумус', 6, ['Noxud pastası, zeytun yağı ilə', 'Chickpea dip with olive oil', 'Паста из нута с оливковым маслом']),
      i('Badımcan rulet', 'Eggplant rolls', 'Рулетики из баклажанов', 7, ['Qozlu və sarımsaqlı', 'With walnuts and garlic', 'С грецким орехом и чесноком'], 'eggplant rolls'),
      i('Ağ pendirli qarpız', 'Watermelon with feta', 'Арбуз с брынзой', 7, ['Yay qəlyanaltısı', 'Summer appetizer', 'Летняя закуска'], 'watermelon feta'),
      i('Kürü', 'Red caviar', 'Красная икра', 20, ['Yağ və tost ilə', 'With butter and toast', 'С маслом и тостами'], 'red caviar'),
      i('Mütəbbəl', 'Baba ganoush', 'Бабагануш', 6, ['Közlənmiş badımcan pastası', 'Smoked eggplant dip', 'Паста из печёного баклажана']),
      i('Qatıq', 'Yogurt', 'Катык', 3, ['Ev qatığı', 'Homemade yogurt', 'Домашний катык'], 'yogurt bowl'),
      i('Somon assorti', 'Salmon platter', 'Ассорти из лосося', 16, ['Duzlanmış somon balığı', 'Cured salmon slices', 'Слабосолёный лосось'], 'smoked salmon'),
      i('Bruskettalar', 'Bruschetta', 'Брускетта', 8, ['Pomidor və reyhanla', 'With tomato and basil', 'С томатами и базиликом']),
    ],
  },
  {
    name: t('Salatlar', 'Salads', 'Салаты'),
    items: [
      i('Xırt-xırt badımcan salatı', 'Crispy eggplant salad', 'Салат с хрустящим баклажаном', 8, ['Qızardılmış badımcan, şirin sous', 'Fried eggplant, sweet sauce', 'Жареный баклажан, сладкий соус'], 'fried eggplant salad'),
      i('Turşulu pomidor salatı', 'Tomato salad with sour plum', 'Томатный салат с алычой', 7, ['Pomidor, soğan, alça turşusu', 'Tomato, onion, plum sauce', 'Помидоры, лук, соус из алычи'], 'tomato onion salad'),
      i('Sezar (toyuq ilə)', 'Caesar with chicken', 'Цезарь с курицей', 12, ['Toyuq, kahı, parmezan, kruton', 'Chicken, lettuce, parmesan, croutons', 'Курица, салат, пармезан, гренки'], 'chicken caesar salad'),
      i('Sezar (krevetka ilə)', 'Caesar with shrimp', 'Цезарь с креветками', 14, ['Krevetka, kahı, parmezan', 'Shrimp, lettuce, parmesan', 'Креветки, салат, пармезан'], 'shrimp caesar salad'),
      i('Tuna salatı', 'Tuna salad', 'Салат с тунцом', 12, ['Tuna, qarğıdalı, tərəvəz', 'Tuna, corn, vegetables', 'Тунец, кукуруза, овощи']),
      i('Çoban salatı', 'Shepherd salad', 'Пастуший салат', 6, ['Pomidor, xiyar, soğan, göyərti', 'Tomato, cucumber, onion, herbs', 'Помидоры, огурцы, лук, зелень'], 'shepherd salad'),
      i('Yunan salatı', 'Greek salad', 'Греческий салат', 9, ['Feta, zeytun, tərəvəz', 'Feta, olives, vegetables', 'Фета, оливки, овощи']),
      i('Paytaxt salatı', 'Olivier salad', 'Оливье', 7, ['Klassik paytaxt salatı', 'Classic Olivier salad', 'Классический оливье'], 'olivier salad'),
      i('Mimoza', 'Mimosa salad', 'Мимоза', 8, ['Balıq, yumurta, pendir qatları', 'Layers of fish, egg, cheese', 'Слои рыбы, яиц и сыра'], 'mimosa salad'),
      i('Vitamin salatı', 'Vitamin salad', 'Витаминный салат', 6, ['Kələm, yerkökü, alma', 'Cabbage, carrot, apple', 'Капуста, морковь, яблоко'], 'coleslaw'),
      i('Ət salatı', 'Beef salad', 'Мясной салат', 11, ['Mal əti, tərəvəz, sous', 'Beef, vegetables, sauce', 'Говядина, овощи, соус'], 'beef salad'),
      i('Kapreze', 'Caprese', 'Капрезе', 10, ['Motsarella, pomidor, reyhan', 'Mozzarella, tomato, basil', 'Моцарелла, томаты, базилик'], 'caprese salad'),
      i('Tabule', 'Tabbouleh', 'Табуле', 7, ['Bulqur, cəfəri, limon', 'Bulgur, parsley, lemon', 'Булгур, петрушка, лимон']),
      i('Kinoa salatı', 'Quinoa salad', 'Салат с киноа', 10, ['Kinoa, avokado, tərəvəz', 'Quinoa, avocado, vegetables', 'Киноа, авокадо, овощи']),
      i('Göbələkli isti salat', 'Warm mushroom salad', 'Тёплый салат с грибами', 10, ['Qızardılmış göbələk, kahı', 'Sautéed mushrooms, lettuce', 'Жареные грибы, салат'], 'mushroom salad'),
    ],
  },
  {
    name: t('Şorbalar', 'Soups', 'Супы'),
    items: [
      i('Düşbərə', 'Dushbara', 'Дюшбара', 6, ['Ətli kiçik düşbərələr', 'Tiny meat dumplings in broth', 'Мелкие пельмени в бульоне'], 'dushbara'),
      i('Tomat şorbası', 'Tomato soup', 'Томатный суп', 5, ['Kremli pomidor şorbası', 'Creamy tomato soup', 'Крем-суп из томатов']),
      i('Tərəvəzli toyuq şorbası', 'Chicken vegetable soup', 'Куриный суп с овощами', 5, ['Toyuq və tərəvəzlər', 'Chicken and vegetables', 'Курица и овощи'], 'chicken vegetable soup'),
      i('Mərcimək şorbası', 'Lentil soup', 'Чечевичный суп', 4, ['Qırmızı mərcimək şorbası', 'Red lentil soup', 'Суп из красной чечевицы']),
      i('Göbələk şorbası', 'Mushroom soup', 'Грибной суп', 6, ['Kremli göbələk şorbası', 'Cream of mushroom soup', 'Грибной крем-суп'], 'cream of mushroom soup'),
      i('Dovğa', 'Dovga', 'Довга', 4, ['Qatıq və göyərti şorbası', 'Yogurt and herb soup', 'Суп из катыка с зеленью'], 'dovga'),
      i('Piti', 'Piti', 'Пити', 10, ['Şəki pitisi, quzu əti ilə', 'Sheki-style lamb and chickpea soup', 'Шекинский пити из баранины'], 'piti soup'),
      i('Kələm şorbası', 'Cabbage soup', 'Щи', 5, ['Ətli kələm şorbası', 'Cabbage soup with meat', 'Щи с мясом'], 'shchi'),
      i('Borş', 'Borscht', 'Борщ', 6, ['Çuğundur şorbası, xama ilə', 'Beet soup with sour cream', 'Свекольный суп со сметаной']),
      i('Kufta bozbaş', 'Kufta bozbash', 'Кюфта бозбаш', 8, ['İri küftə, noxud, kartof', 'Large meatballs, chickpeas, potato', 'Крупные тефтели, нут, картофель'], 'kufta bozbash'),
      i('Toyuq bulyonu', 'Chicken broth', 'Куриный бульон', 4, ['Əriştə ilə şəffaf bulyon', 'Clear broth with noodles', 'Прозрачный бульон с лапшой'], 'chicken noodle soup'),
      i('Balıq şorbası', 'Fish soup', 'Уха', 8, ['Balıq və tərəvəz', 'Fish and vegetables', 'Рыба и овощи'], 'ukha'),
      i('Soğan şorbası', 'French onion soup', 'Луковый суп', 6, ['Pendirli kruton ilə', 'With cheese croutons', 'С сырными гренками']),
      i('Xaş', 'Khash', 'Хаш', 9, ['Sarımsaq və sirkə ilə', 'With garlic and vinegar', 'С чесноком и уксусом'], 'khash soup'),
      i('Qarğıdalı şorbası', 'Corn soup', 'Кукурузный суп', 5, ['Kremli qarğıdalı şorbası', 'Creamy corn soup', 'Кукурузный крем-суп'], 'corn chowder'),
    ],
  },
  {
    name: t('Tava yeməkləri', 'Pan dishes', 'Блюда на сковороде'),
    items: [
      i('Gilənar souslu can əti qovurma', 'Veal with cherry sauce', 'Телятина в вишнёвом соусе', 19, ['Can əti, gilənar sousu', 'Veal, sour cherry sauce', 'Телятина, вишнёвый соус'], 'beef with cherry sauce'),
      i('Can əti nar qovurması', 'Veal with pomegranate', 'Телятина с гранатом', 19, ['Nar və soğanla qovurma', 'Fried with pomegranate and onion', 'Жарится с гранатом и луком'], 'beef stir fry pomegranate'),
      i('Çoban qovurma', 'Shepherd stir-fry', 'Чобан кавурма', 15, ['Ət, bibər, pomidor', 'Meat, peppers, tomato', 'Мясо, перец, помидоры'], 'coban kavurma'),
      i('Tuşonka', 'Braised beef', 'Тушёнка', 14, ['Yavaş bişmiş mal əti', 'Slow-cooked beef', 'Томлёная говядина'], 'beef stew'),
      i('Tabaka', 'Chicken tabaka', 'Цыплёнок табака', 18, ['Basqı altında qızardılmış cücə', 'Pressed fried chicken', 'Жареный цыплёнок под прессом'], 'chicken tabaka'),
      i('Yarpaq dolması', 'Vine leaf dolma', 'Долма в виноградных листьях', 9, ['Qatıq ilə', 'Served with yogurt', 'Подаётся с катыком'], 'dolma'),
      i('Qaymaqlı can əti', 'Veal in cream sauce', 'Телятина в сливках', 19, ['Qaymaqlı sousda can əti', 'Veal in creamy sauce', 'Телятина в сливочном соусе'], 'beef cream sauce'),
      i('Medalyon', 'Medallions', 'Медальоны', 22, ['Mal əti medalyonları', 'Beef tenderloin medallions', 'Медальоны из говяжьей вырезки'], 'beef medallions'),
      i('Ət langeti', 'Beef langet', 'Лангет из говядины', 15, ['Qızardılmış mal əti dilimləri', 'Pan-fried beef slices', 'Жареные ломтики говядины'], 'pan fried steak'),
      i('Toyuq langeti', 'Chicken langet', 'Куриный лангет', 12, ['Qızardılmış toyuq filesi', 'Pan-fried chicken fillet', 'Жареное куриное филе'], 'pan fried chicken breast'),
      i('Toyuq şnitsel', 'Chicken schnitzel', 'Куриный шницель', 13, ['Paneli qızardılmış toyuq', 'Breaded fried chicken', 'Курица в панировке'], 'chicken schnitzel'),
      i('Toyuq stroqanof', 'Chicken stroganoff', 'Строганов из курицы', 14, ['Qaymaqlı göbələk sousu ilə', 'In creamy mushroom sauce', 'В сливочно-грибном соусе'], 'chicken stroganoff'),
      i('Ət stroqanof', 'Beef stroganoff', 'Бефстроганов', 17, ['Klassik bef-stroqanof', 'Classic beef stroganoff', 'Классический бефстроганов']),
      i('Ət faxitos', 'Beef fajitas', 'Фахитос с говядиной', 15, ['Bibər və soğanla', 'With peppers and onions', 'С перцем и луком'], 'beef fajitas'),
      i('Toyuq faxitos', 'Chicken fajitas', 'Фахитос с курицей', 12, ['Bibər və soğanla', 'With peppers and onions', 'С перцем и луком'], 'chicken fajitas'),
    ],
  },
  {
    name: t('Pizzalar', 'Pizzas', 'Пиццы'),
    items: [
      i('Marqarita', 'Margherita', 'Маргарита', 12, ['Tomat sousu, motsarella, reyhan', 'Tomato sauce, mozzarella, basil', 'Томатный соус, моцарелла, базилик'], 'pizza margherita'),
      i('Sucuqlu pizza', 'Sujuk pizza', 'Пицца с суджуком', 14, ['Sucuq, motsarella', 'Sujuk sausage, mozzarella', 'Суджук, моцарелла'], 'sucuk pizza'),
      i('Toyuqlu pizza', 'Chicken pizza', 'Пицца с курицей', 14, ['Toyuq, göbələk, pendir', 'Chicken, mushrooms, cheese', 'Курица, грибы, сыр']),
      i('Sezar pizza', 'Caesar pizza', 'Пицца Цезарь', 14, ['Toyuq, kahı, sezar sousu', 'Chicken, lettuce, Caesar sauce', 'Курица, салат, соус цезарь'], 'chicken caesar pizza'),
      i('Meksikano pizza', 'Mexicano pizza', 'Пицца Мексикано', 14, ['Acılı ət, bibər, qarğıdalı', 'Spicy meat, peppers, corn', 'Острое мясо, перец, кукуруза'], 'jalapeno pizza'),
      i('Qarışıq pizza', 'Mixed pizza', 'Ассорти пицца', 15, ['Sucuq, göbələk, bibər, zeytun', 'Sujuk, mushrooms, peppers, olives', 'Суджук, грибы, перец, оливки'], 'supreme pizza'),
      i('Pepperoni', 'Pepperoni', 'Пепперони', 14, ['Pepperoni, motsarella', 'Pepperoni, mozzarella', 'Пепперони, моцарелла'], 'pepperoni pizza'),
      i('Dörd pendir', 'Four cheese', 'Четыре сыра', 15, ['Motsarella, qorqonzola, parmezan, çeddar', 'Mozzarella, gorgonzola, parmesan, cheddar', 'Моцарелла, горгонзола, пармезан, чеддер'], 'quattro formaggi pizza'),
      i('Vegetarian pizza', 'Vegetarian pizza', 'Вегетарианская пицца', 12, ['Mövsüm tərəvəzləri', 'Seasonal vegetables', 'Сезонные овощи'], 'vegetable pizza'),
      i('Göbələkli pizza', 'Mushroom pizza', 'Пицца с грибами', 13, ['Göbələk, motsarella', 'Mushrooms, mozzarella', 'Грибы, моцарелла']),
      i('Havay pizza', 'Hawaiian pizza', 'Гавайская пицца', 14, ['Toyuq, ananas, pendir', 'Chicken, pineapple, cheese', 'Курица, ананас, сыр']),
      i('Barbekü pizza', 'BBQ pizza', 'Пицца барбекю', 15, ['Ət, barbekü sousu, soğan', 'Meat, BBQ sauce, onion', 'Мясо, соус барбекю, лук'], 'bbq chicken pizza'),
      i('Tunalı pizza', 'Tuna pizza', 'Пицца с тунцом', 14, ['Tuna, soğan, zeytun', 'Tuna, onion, olives', 'Тунец, лук, оливки']),
      i('Dəniz məhsulları pizza', 'Seafood pizza', 'Пицца с морепродуктами', 18, ['Krevetka, kalmar, midiya', 'Shrimp, squid, mussels', 'Креветки, кальмар, мидии']),
      i('Kalzone', 'Calzone', 'Кальцоне', 14, ['Qapalı pizza, ət və pendirlə', 'Folded pizza with meat and cheese', 'Закрытая пицца с мясом и сыром']),
    ],
  },
  {
    name: t('Sendviç & Dürüm', 'Sandwiches & Wraps', 'Сэндвичи и дюрюм'),
    items: [
      i('Şaurma', 'Shawarma', 'Шаурма', 7, ['Toyuq, tərəvəz, sous', 'Chicken, vegetables, sauce', 'Курица, овощи, соус']),
      i('Club sendviç', 'Club sandwich', 'Клаб-сэндвич', 8, ['Toyuq, bekon, yumurta, tərəvəz', 'Chicken, bacon, egg, vegetables', 'Курица, бекон, яйцо, овощи']),
      i('Toyuq dürüm', 'Chicken wrap', 'Дюрюм с курицей', 6, ['Lavaşda toyuq', 'Chicken in lavash', 'Курица в лаваше'], 'chicken durum wrap'),
      i('Ət dürüm', 'Beef wrap', 'Дюрюм с мясом', 10, ['Lavaşda mal əti', 'Beef in lavash', 'Говядина в лаваше'], 'doner durum'),
      i('Sezar roll', 'Caesar wrap', 'Цезарь ролл', 9, ['Toyuq, kahı, sezar sousu', 'Chicken, lettuce, Caesar sauce', 'Курица, салат, соус цезарь'], 'chicken caesar wrap'),
      i('Hamburger', 'Hamburger', 'Гамбургер', 9, ['Mal əti kotleti, tərəvəz', 'Beef patty, vegetables', 'Говяжья котлета, овощи']),
      i('Çizburger', 'Cheeseburger', 'Чизбургер', 10, ['Mal əti, çeddar pendiri', 'Beef, cheddar cheese', 'Говядина, сыр чеддер']),
      i('Toyuq burger', 'Chicken burger', 'Куриный бургер', 8, ['Xırtıldayan toyuq filesi', 'Crispy chicken fillet', 'Хрустящее куриное филе'], 'crispy chicken burger'),
      i('Tuna sendviç', 'Tuna sandwich', 'Сэндвич с тунцом', 7, ['Tuna, xiyar, mayonez', 'Tuna, cucumber, mayo', 'Тунец, огурец, майонез']),
      i('Panini', 'Panini', 'Панини', 8, ['Qızardılmış çörəkdə pendir, ət', 'Grilled bread with cheese and ham', 'Поджаренный хлеб с сыром и ветчиной']),
      i('Kəbab dürüm', 'Kebab wrap', 'Кебаб дюрюм', 9, ['Lülə kabab lavaşda', 'Lula kebab in lavash', 'Люля-кебаб в лаваше'], 'adana durum'),
      i('Falafel dürüm', 'Falafel wrap', 'Фалафель ролл', 6, ['Falafel, humus, tərəvəz', 'Falafel, hummus, vegetables', 'Фалафель, хумус, овощи']),
      i('Hot-doq', 'Hot dog', 'Хот-дог', 5, ['Sosiska, sous, soğan', 'Sausage, sauce, onion', 'Сосиска, соус, лук']),
      i('Kvesadilya', 'Quesadilla', 'Кесадилья', 9, ['Toyuq, pendir, bibər', 'Chicken, cheese, peppers', 'Курица, сыр, перец']),
      i('Tost', 'Toasted sandwich', 'Тост', 5, ['Pendirli, qızardılmış tost', 'Grilled cheese toast', 'Горячий тост с сыром'], 'grilled cheese sandwich'),
    ],
  },
  {
    name: t('Desertlər', 'Desserts', 'Десерты'),
    items: [
      i('Künəfə', 'Kunefe', 'Кюнефе', 10, ['İsti pendirli kadayıf', 'Warm cheese kadaif', 'Горячий кадаиф с сыром'], 'kunefe'),
      i('Ballı tort', 'Honey cake', 'Медовик', 8, ['Klassik ballı tort', 'Classic honey cake', 'Классический медовик'], 'medovik'),
      i('Tiramisu', 'Tiramisu', 'Тирамису', 8, ['Maskarpone və qəhvə', 'Mascarpone and coffee', 'Маскарпоне и кофе']),
      i('Trileçe', 'Trilece', 'Трилече', 8, ['Üç süd tortu, karamel ilə', 'Three-milk cake with caramel', 'Торт из трёх видов молока с карамелью'], 'tres leches cake'),
      i('Türk paxlavası', 'Turkish baklava', 'Турецкая пахлава', 7, ['Fıstıqlı paxlava', 'Pistachio baklava', 'Пахлава с фисташками'], 'baklava pistachio'),
      i('Südlü paxlava', 'Milk baklava', 'Молочная пахлава', 8, ['Soyuq südlü paxlava', 'Cold milk baklava', 'Холодная молочная пахлава'], 'baklava'),
      i('San Sebastian', 'San Sebastian cheesecake', 'Сан-Себастьян', 8, ['Yandırılmış çizkeyk', 'Burnt Basque cheesecake', 'Баскский чизкейк'], 'basque burnt cheesecake'),
      i('Çizkeyk', 'Cheesecake', 'Чизкейк', 8, ['Giləmeyvə sousu ilə', 'With berry sauce', 'С ягодным соусом']),
      i('Maqnoliya', 'Magnolia', 'Магнолия', 8, ['Krem, biskvit, meyvə', 'Cream, biscuit, fruit', 'Крем, печенье, фрукты'], 'banana pudding magnolia'),
      i('Red Velvet', 'Red Velvet', 'Красный бархат', 8, ['Qırmızı biskvit, krem pendir', 'Red sponge, cream cheese', 'Красный бисквит, сливочный сыр'], 'red velvet cake'),
      i('Şokoladlı sufle', 'Chocolate fondant', 'Шоколадный фондан', 8, ['İsti şokolad ürəkli', 'Warm molten chocolate', 'С жидким шоколадом внутри'], 'chocolate lava cake'),
      i('Napoleon', 'Napoleon cake', 'Наполеон', 7, ['Laylı xəmir və krem', 'Puff pastry and custard', 'Слоёное тесто и крем'], 'napoleon cake'),
      i('Dondurma', 'Ice cream', 'Мороженое', 5, ['Üç top, seçiminizə görə', 'Three scoops of your choice', 'Три шарика на выбор']),
      i('Meyvə assorti (2 nəfərlik)', 'Fruit platter (for 2)', 'Фруктовое ассорти (на 2)', 15, ['Mövsüm meyvələri', 'Seasonal fruits', 'Сезонные фрукты'], 'fruit platter'),
      i('Şəkərbura', 'Shakarbura', 'Шекербура', 6, ['Qozlu Novruz şirniyyatı', 'Walnut-filled pastry', 'Пирожок с орехами'], 'shekerbura'),
    ],
  },
  {
    name: t('Qəhvə', 'Coffee', 'Кофе'),
    items: [
      i('Americano', 'Americano', 'Американо', 4, ['Espresso və isti su', 'Espresso with hot water', 'Эспрессо с горячей водой'], 'caffe americano'),
      i('Espresso', 'Espresso', 'Эспрессо', 5, ['Qatı italyan qəhvəsi', 'Strong Italian coffee', 'Крепкий итальянский кофе']),
      i('Double Espresso', 'Double espresso', 'Двойной эспрессо', 6, ['İkiqat espresso', 'Double shot espresso', 'Двойная порция эспрессо'], 'doppio espresso'),
      i('Latte', 'Latte', 'Латте', 5, ['Espresso və çox süd', 'Espresso with lots of milk', 'Эспрессо с большим количеством молока'], 'caffe latte'),
      i('Kapuçino', 'Cappuccino', 'Капучино', 6, ['Espresso, süd köpüyü', 'Espresso, milk foam', 'Эспрессо, молочная пена']),
      i('Raf qəhvə', 'Raf coffee', 'Раф кофе', 6, ['Qaymaq və vanil ilə', 'With cream and vanilla', 'Со сливками и ванилью'], 'raf coffee'),
      i('Mokka', 'Mocha', 'Мокка', 7, ['Espresso, şokolad, süd', 'Espresso, chocolate, milk', 'Эспрессо, шоколад, молоко'], 'caffe mocha'),
      i('Türk qəhvəsi', 'Turkish coffee', 'Кофе по-турецки', 5, ['Cəzvədə dəmlənmiş', 'Brewed in a cezve', 'Сваренный в турке']),
      i('Flat White', 'Flat white', 'Флэт уайт', 6, ['İkiqat espresso, nazik süd', 'Double espresso, thin milk', 'Двойной эспрессо, тонкое молоко']),
      i('Makiato', 'Macchiato', 'Макиато', 5, ['Espresso, bir az süd köpüyü', 'Espresso with a dash of foam', 'Эспрессо с каплей пены'], 'caffe macchiato'),
      i('Ays latte', 'Iced latte', 'Айс латте', 6, ['Buzlu latte', 'Latte over ice', 'Латте со льдом']),
      i('Ays amerikano', 'Iced americano', 'Айс американо', 5, ['Buzlu americano', 'Americano over ice', 'Американо со льдом'], 'iced coffee'),
      i('Frappe', 'Frappe', 'Фраппе', 7, ['Köpüklü soyuq qəhvə', 'Frothy cold coffee', 'Взбитый холодный кофе'], 'frappe coffee'),
      i('Karamel latte', 'Caramel latte', 'Карамельный латте', 7, ['Karamel siropu ilə', 'With caramel syrup', 'С карамельным сиропом'], 'caramel latte'),
      i('Affoqato', 'Affogato', 'Аффогато', 7, ['Espresso və dondurma', 'Espresso over ice cream', 'Эспрессо с мороженым']),
    ],
  },
  {
    name: t('Sərin içkilər', 'Cold drinks', 'Прохладительные напитки'),
    items: [
      i('Coca-Cola (1 L)', 'Coca-Cola (1 L)', 'Кока-Кола (1 л)', 4, ['Böyük şüşə', 'Large bottle', 'Большая бутылка'], 'coca-cola bottle'),
      i('Coca-Cola 0.3 L', 'Coca-Cola 0.3 L', 'Кока-Кола 0,3 л', 3, ['Kiçik şüşə', 'Small bottle', 'Маленькая бутылка'], 'coca-cola glass bottle'),
      i('Sirab (qazlı)', 'Sirab (sparkling)', 'Сираб (газированная)', 3, ['Qazlı mineral su', 'Sparkling mineral water', 'Газированная минеральная вода'], 'sparkling water glass'),
      i('Sirab (qazsız)', 'Sirab (still)', 'Сираб (негазированная)', 3, ['Qazsız mineral su', 'Still mineral water', 'Негазированная вода'], 'water bottle glass'),
      i('Red Bull', 'Red Bull', 'Red Bull', 7, ['Enerji içkisi', 'Energy drink', 'Энергетический напиток'], 'red bull can'),
      i('Ice Tea (0.33 L)', 'Iced tea (0.33 L)', 'Холодный чай (0,33 л)', 3, ['Şaftalı və ya limon', 'Peach or lemon', 'Персик или лимон'], 'iced tea'),
      i('Tonik', 'Tonic water', 'Тоник', 3, ['Qazlı tonik', 'Sparkling tonic', 'Газированный тоник']),
      i('Meyvə şirəsi', 'Fruit juice', 'Фруктовый сок', 5, ['Portağal, alma, albalı', 'Orange, apple, cherry', 'Апельсин, яблоко, вишня'], 'orange juice glass'),
      i('Gilənar kompotu', 'Sour cherry compote', 'Вишнёвый компот', 5, ['Ev kompotu', 'Homemade compote', 'Домашний компот'], 'cherry compote'),
      i('Gürcü limonadı', 'Georgian lemonade', 'Грузинский лимонад', 4, ['Tarxun və ya armud', 'Tarragon or pear', 'Тархун или груша'], 'tarragon lemonade'),
      i('Ayran', 'Ayran', 'Айран', 1.5, ['Soyuq, təzə ayran', 'Cold fresh ayran', 'Холодный свежий айран']),
      i('Fanta 0.3 L', 'Fanta 0.3 L', 'Фанта 0,3 л', 3, ['Portağallı qazlı içki', 'Orange soda', 'Апельсиновая газировка'], 'fanta orange'),
      i('Sprite 0.3 L', 'Sprite 0.3 L', 'Спрайт 0,3 л', 3, ['Limonlu qazlı içki', 'Lemon-lime soda', 'Лимонная газировка'], 'sprite soda'),
      i('Ev sayağı limonad', 'Homemade lemonade', 'Домашний лимонад', 13, ['Limon, nanə, 1 L', 'Lemon, mint, 1 L', 'Лимон, мята, 1 л'], 'lemonade pitcher'),
      i('Mojito (alkoqolsuz)', 'Virgin mojito', 'Мохито (безалкогольный)', 8, ['Nanə, laym, soda', 'Mint, lime, soda', 'Мята, лайм, содовая'], 'mojito'),
    ],
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Wikimedia sürətli sorğularda 429 qaytarır: gözləyib yenidən cəhd et
async function politeFetch(url) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (res.status !== 429) return res;
    await sleep(Number(res.headers.get('retry-after')) * 1000 || 5000 * (attempt + 1));
  }
  return null;
}

async function findImage(query) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '8',
    prop: 'imageinfo',
    iiprop: 'url|mime',
    iiurlwidth: '480',
  }).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await politeFetch(url);
  if (!res?.ok) return null;
  const pages = Object.values((await res.json()).query?.pages || {}).sort((a, b) => a.index - b.index);
  const hit = pages.find((p) => p.imageinfo?.[0]?.mime === 'image/jpeg' && p.imageinfo[0].thumburl);
  return hit?.imageinfo[0].thumburl || null;
}

// Şəkli yükləyir, /uploads/... yolunu qaytarır. Tapılmasa boş sətir.
async function ensureImage(slug, query) {
  const file = `seed-${slug}.jpg`;
  const dest = path.join(UPLOAD_DIR, file);
  if (existsSync(dest)) return `/uploads/${file}`;

  try {
    const src = await findImage(query);
    if (!src) return '';
    await sleep(1000);
    const res = await politeFetch(src);
    if (!res?.ok) return '';
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    return `/uploads/${file}`;
  } catch {
    return '';
  }
}

await connectDB(MONGO_URI);

try {
  let itemCount = 0;
  const missing = [];

  for (const [catIndex, cat] of MENU.entries()) {
    const slug = slugify(cat.name.az);
    const images = [];
    for (const item of cat.items) {
      const image = await ensureImage(`${slug}-${slugify(item.name.en)}`, item.query);
      if (!image) missing.push(item.name.az);
      images.push(image);
    }

    const category = await Category.findOneAndUpdate(
      { slug },
      {
        $set: { name: cat.name, image: images.find(Boolean) || '' },
        $setOnInsert: { slug, order: ORDER_START + catIndex, isActive: true },
      },
      { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true }
    );

    for (const [itemIndex, item] of cat.items.entries()) {
      await MenuItem.updateOne(
        { category: category._id, 'name.az': item.name.az },
        {
          $set: { name: item.name, description: item.description, price: item.price, image: images[itemIndex] },
          $setOnInsert: { category: category._id, order: itemIndex, isAvailable: true },
        },
        { upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
      itemCount++;
    }
    console.log(`Bölmə hazırdır: ${cat.name.az} (${slug}), ${cat.items.length} məhsul`);
  }

  console.log(`Yazıldı: ${MENU.length} bölmə, ${itemCount} məhsul`);
  if (missing.length) console.log(`Şəkil tapılmadı (${missing.length}): ${missing.join(', ')}`);
} finally {
  await mongoose.disconnect();
}
