import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';
import { removeUpload } from '../utils/files.js';

export async function list(req, res) {
  const filter = req.query.category ? { category: req.query.category } : {};
  const items = await MenuItem.find(filter)
    .populate('category', 'name slug')
    .sort({ order: 1, createdAt: 1 });
  res.json(items);
}

export async function getOne(req, res) {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Məhsul tapılmadı' });
  res.json(item);
}

async function ensureCategory(id, res) {
  const exists = await Category.exists({ _id: id });
  if (!exists) res.status(400).json({ message: 'Belə bölmə yoxdur' });
  return exists;
}

export async function create(req, res) {
  if (!(await ensureCategory(req.body.category, res))) return;
  const item = await MenuItem.create(req.body);
  res.status(201).json(item);
}

export async function update(req, res) {
  if (!(await ensureCategory(req.body.category, res))) return;
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Məhsul tapılmadı' });

  const oldImage = item.image;
  item.set(req.body);
  await item.save();
  if (oldImage !== item.image) await removeUpload(oldImage);
  res.json(item);
}

export async function remove(req, res) {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Məhsul tapılmadı' });
  await removeUpload(item.image);
  res.json({ message: 'Silindi' });
}
