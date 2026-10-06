import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';

const SORT = { order: 1, createdAt: 1 };

export async function listCategories(req, res) {
  const categories = await Category.find({ isActive: true }).sort(SORT);
  res.json(categories);
}

export async function categoryItems(req, res) {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) return res.status(404).json({ message: 'Bölmə tapılmadı' });
  const items = await MenuItem.find({ category: category._id }).sort(SORT);
  res.json({ category, items });
}

// Bütün menyu bir sorğuda: aktiv bölmələr və onların məhsulları.
export async function fullMenu(req, res) {
  const categories = await Category.find({ isActive: true }).sort(SORT).lean();
  const items = await MenuItem.find({ category: { $in: categories.map((c) => c._id) } })
    .sort(SORT)
    .lean();
  res.json(categories.map((c) => ({ ...c, items: items.filter((i) => i.category.equals(c._id)) })));
}
