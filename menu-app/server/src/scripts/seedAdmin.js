import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';

const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('.env faylında ADMIN_EMAIL və ADMIN_PASSWORD yazın');
  process.exit(1);
}

await connectDB(MONGO_URI);
const passwordHash = await Admin.hashPassword(ADMIN_PASSWORD);
await Admin.findOneAndUpdate({ email: ADMIN_EMAIL.toLowerCase() }, { passwordHash }, { upsert: true });
console.log(`Admin hazırdır: ${ADMIN_EMAIL}`);
await mongoose.disconnect();
