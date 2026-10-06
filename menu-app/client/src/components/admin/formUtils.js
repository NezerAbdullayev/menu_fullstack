// Admin formları üçün köməkçi funksiyalar.
// PUT sorğuları tam obyekt tələb edir, ona görə body həmişə bütün sahələrlə qurulur.

export const LANGS = ['az', 'en', 'ru']

/** {az,en,ru} obyektini boş sətirlərlə tamamlayır. */
export function normalizeLocalized(obj) {
  const src = obj && typeof obj === 'object' ? obj : {}
  return LANGS.reduce((acc, lng) => {
    acc[lng] = typeof src[lng] === 'string' ? src[lng].trim() : ''
    return acc
  }, {})
}

/** Bölmə obyektindən (və ya form dəyərlərindən) PUT/POST body. */
export function toCategoryBody(source, overrides = {}) {
  const data = { ...source, ...overrides }
  const body = {
    name: normalizeLocalized(data.name),
    image: data.image || '',
    order: Number.isInteger(data.order) ? data.order : 0,
    isActive: data.isActive !== false,
  }
  const slug = typeof data.slug === 'string' ? data.slug.trim() : ''
  if (slug) body.slug = slug
  return body
}

/** Məhsul obyektindən PUT/POST body. category populate olunubsa yalnız _id götürülür. */
export function toItemBody(source, overrides = {}) {
  const data = { ...source, ...overrides }
  const category = data.category && typeof data.category === 'object' ? data.category._id : data.category
  return {
    category,
    name: normalizeLocalized(data.name),
    description: normalizeLocalized(data.description),
    price: Number(data.price) || 0,
    image: data.image || '',
    order: Number.isInteger(data.order) ? data.order : 0,
    isAvailable: data.isAvailable !== false,
  }
}

/** Serverin validasiya xətalarını ([{path:'name.az', message}]) Form sahələrinə yazır. */
export function applyServerErrors(form, fields) {
  if (!Array.isArray(fields) || fields.length === 0) return false
  form.setFields(
    fields
      .filter((f) => f?.path)
      .map((f) => ({ name: String(f.path).split('.'), errors: [f.message] })),
  )
  return true
}

/** ids massivində index-dəki elementi yuxarı (-1) və ya aşağı (+1) aparır. */
export function moveId(ids, index, delta) {
  const target = index + delta
  if (target < 0 || target >= ids.length) return null
  const next = [...ids]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}
