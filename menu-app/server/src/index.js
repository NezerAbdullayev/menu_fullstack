import app from './app.js';
import { connectDB } from './config/db.js';

const { PORT = 5000, MONGO_URI, JWT_SECRET } = process.env;

if (!MONGO_URI || !JWT_SECRET) {
  console.error('.env faylında MONGO_URI və JWT_SECRET mütləqdir');
  process.exit(1);
}

try {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => console.log(`Server işləyir: http://localhost:${PORT}`));
} catch (err) {
  console.error('MongoDB-yə qoşulmaq alınmadı:', err.message);
  process.exit(1);
}
