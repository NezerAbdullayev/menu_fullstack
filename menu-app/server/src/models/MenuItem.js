import mongoose from 'mongoose';
import { localizedString } from './localized.js';

const menuItemSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    name: localizedString(true),
    description: localizedString(false),
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('MenuItem', menuItemSchema);
