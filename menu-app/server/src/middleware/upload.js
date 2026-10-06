import multer from 'multer';
import crypto from 'node:crypto';
import { UPLOAD_DIR } from '../utils/files.js';

// Genişləmə fayl adından yox, yoxlanmış MIME tipindən götürülür.
// Əks halda "x.html" adlı, image/png kimi göndərilən fayl .html kimi saxlanıb
// /uploads altından text/html olaraq verilərdi (saxlanan XSS).
const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ALLOWED[file.mimetype]}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (Object.hasOwn(ALLOWED, file.mimetype)) cb(null, true);
    else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Yalnız JPG, PNG və WEBP qəbul olunur'));
  },
});
