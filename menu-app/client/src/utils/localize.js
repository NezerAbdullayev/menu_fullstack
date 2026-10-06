/**
 * Lokallaşdırılmış sahədən ({az, en, ru}) seçilmiş dilin mətnini qaytarır.
 * Dil yoxdursa az, o da yoxdursa boş sətir.
 */
export function localize(obj, lang) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  const short = (lang || 'az').slice(0, 2)
  return obj[short] || obj.az || ''
}

export default localize
