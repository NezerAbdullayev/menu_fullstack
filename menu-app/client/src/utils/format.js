/**
 * formatPrice(12.5) -> "12.50 ₼"
 */
export function formatPrice(n) {
  const num = Number(n)
  if (!Number.isFinite(num)) return ''
  return `${num.toFixed(2)} ₼`
}

export default formatPrice
