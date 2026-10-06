import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './public.css'

/**
 * Bölmələr arasında keçid üçün üfüqi sürüşən düymə zolağı.
 * categories: [{ slug, label }], activeSlug: seçilmiş bölmə, onSelect(slug): klikdə çağırılır.
 */
export default function CategoryTabs({ categories, activeSlug, onSelect }) {
  const { t } = useTranslation('public')
  const activeRef = useRef(null)

  // Aktiv düyməni görünən sahəyə gətir (yalnız zolaq daxilində, səhifə sürüşmür)
  useEffect(() => {
    const el = activeRef.current
    const strip = el?.parentElement
    if (!el || !strip) return
    const left = el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2
    strip.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [activeSlug, categories.length])

  if (!categories.length) return null

  return (
    <nav className="pm-tabs" aria-label={t('categoriesNav')}>
      {categories.map(({ slug, label }) => {
        const active = slug === activeSlug
        return (
          <Link
            key={slug}
            ref={active ? activeRef : undefined}
            to={`/menu/${encodeURIComponent(slug)}`}
            replace
            onClick={() => onSelect?.(slug)}
            className={`pm-tab${active ? ' pm-tab-active' : ''}`}
            aria-current={active ? 'true' : undefined}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
