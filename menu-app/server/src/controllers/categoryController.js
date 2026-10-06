import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';
import { slugify } from '../utils/slugify.js';
import { removeUpload } from '../utils/files.js';

export async function list(req, res) {
  const categories = await Category.find().sort({ order: 1, createdAt: 1 }).lean();
  const counts = await MenuItem.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const byId = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));
  res.json(categories.map((c) => ({ ...c, itemCount: byId[c._id.toString()] || 0 })));
}

export async function getOne(req, res) {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Bölmə tapılmadı' });
  res.json(category);
}

export async function create(req, res) {
  const data = { ...req.body, slug: slugify(req.body.slug || req.body.name.az) };
  if (!data.slug) return res.status(400).json({ message: 'Slug yaradıla bilmədi' });
  const category = await Category.create(data);
  res.status(201).json(category);
}

export async function update(req, res) {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Bölmə tapılmadı' });

  const oldImage = category.image;
  category.set({ ...req.body, slug: slugify(req.body.slug || req.body.name.az) });
  await category.save();
  if (oldImage !== category.image) await removeUpload(oldImage);
  res.json(category);
}

export async function remove(req, res) {
  const count = await MenuItem.countDocuments({ category: req.params.id });
  if (count > 0) {
    return res
      .status(409)
      .json({ message: `Bu bölmədə ${count} məhsul var. Əvvəlcə onları silin və ya köçürün.` });
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Bölmə tapılmadı' });
  await removeUpload(category.image);
  res.json({ message: 'Silindi' });
}
