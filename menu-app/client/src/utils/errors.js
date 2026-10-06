/**
 * RTK Query xətasından oxunaqlı mesaj çıxarır.
 * Server cavabı: { message, errors? }. Şəbəkə xətası: { status: 'FETCH_ERROR' }.
 */
export function getErrorMessage(error, fallback = '') {
  return error?.data?.message || fallback || error?.error || ''
}

/** Serverin validasiya xətaları ([{ path, message }]), yoxdursa null. */
export function getErrorFields(error) {
  return error?.data?.errors || null
}

/** Serverə heç qoşulmaq mümkün olmadı (backend işləmir, internet yoxdur). */
export function isNetworkError(error) {
  return error?.status === 'FETCH_ERROR'
}
