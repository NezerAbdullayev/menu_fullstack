import mongoose from 'mongoose';
import { localizedString } from './localized.js';

const categorySchema = new mongoose.Schema(
  {
    name: localizedString(true),
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
