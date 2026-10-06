import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';

// ids massivindəki sıra ilə order dəyəri yazılır.
export async function reorder(req, res) {
  const Model = req.body.type === 'category' ? Category : MenuItem;
  await Model.bulkWrite(
    req.body.ids.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { order: index } },
    }))
  );
  res.json({ message: 'Sıralama yeniləndi' });
}

export function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ message: 'Fayl göndərilməyib' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
}

export async function stats(req, res) {
  const [categories, items, unavailable] = await Promise.all([
    Category.countDocuments(),
    MenuItem.countDocuments(),
    MenuItem.countDocuments({ isAvailable: false }),
  ]);
  res.json({ categories, items, unavailable });
}
