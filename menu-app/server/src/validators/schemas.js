import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Yanlış ID');

const localized = (required) =>
  z.object({
    az: required
      ? z.string().trim().min(1, 'Azərbaycan dilində ad mütləqdir')
      : z.string().trim().optional().default(''),
    en: z.string().trim().optional().default(''),
    ru: z.string().trim().optional().default(''),
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email yanlışdır'),
  password: z.string().min(1, 'Parol mütləqdir'),
});

export const categorySchema = z.object({
  name: localized(true),
  slug: z.string().trim().optional(),
  image: z.string().optional().default(''),
  order: z.coerce.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const menuItemSchema = z.object({
  category: objectId,
  name: localized(true),
  description: localized(false).optional().default({ az: '', en: '', ru: '' }),
  price: z.coerce.number().min(0, 'Qiymət mənfi ola bilməz'),
  image: z.string().optional().default(''),
  order: z.coerce.number().int().optional().default(0),
  isAvailable: z.boolean().optional().default(true),
});

export const reorderSchema = z.object({
  type: z.enum(['category', 'item']),
  ids: z.array(objectId).min(1),
});
