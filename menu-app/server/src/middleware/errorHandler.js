import multer from 'multer';
import mongoose from 'mongoose';

export function notFound(req, res) {
  res.status(404).json({ message: 'Tapılmadı' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Fayl 5 MB-dan böyük ola bilməz' : err.field || err.message;
    return res.status(400).json({ message });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'Yanlış ID' });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Bu dəyər artıq mövcuddur', fields: Object.keys(err.keyValue || {}) });
  }
  // body-parser xətaları (pozulmuş JSON, 1 MB limiti və s.) öz 4xx statusunu daşıyır.
  const status = err.status || err.statusCode;
  if (status >= 400 && status < 500) {
    const message = err.type === 'entity.parse.failed' ? 'JSON formatı yanlışdır' : err.type === 'entity.too.large' ? 'Sorğu çox böyükdür' : err.message;
    return res.status(status).json({ message });
  }
  console.error(err);
  res.status(500).json({ message: 'Server xətası' });
}
