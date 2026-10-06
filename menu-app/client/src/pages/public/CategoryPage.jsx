import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Result } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGetMenuQuery } from '../../features/api/apiSlice'
import { EmptyState, ErrorState, Loading } from '../../components/PageState'
import CategoryTabs from '../../components/public/CategoryTabs'
import MenuSection from '../../components/public/MenuSection'
import { getErrorMessage, isNetworkError } from '../../utils/errors'
import { localize } from '../../utils/localize'
import '../../components/public/public.css'

const sectionId = (slug) => `sec-${slug}`
const scrollToSection = (slug, smooth) =>
  document
    .getElementById(sectionId(slug))
    ?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
// Proqramla sürüşmə zamanı scroll-spy aktiv düyməni dəyişməsin
const SCROLL_LOCK_MS = 900

/**
 * Menyu səhifəsi (/menu/:slug): bütün bölmələr alt-alta, yuxarıda yapışqan bölmə zolağı.
 * URL-dəki bölməyə sürüşür, aşağı sürüşdükcə aktiv düymə görünən bölməyə görə dəyişir.
 */
export default function CategoryPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('public')
  const lang = (i18n.resolvedLanguage || 'az').slice(0, 2)

  const { data, isLoading, error, refetch } = useGetMenuQuery()
  const sections = useMemo(() => data || [], [data])
  const exists = sections.some((c) => c.slug === slug)

  const [activeSlug, setActiveSlug] = useState(slug)
  const lockUntil = useRef(0)
  const scrolledOnce = useRef(false)
  const stickyRef = useRef(null)

  // URL-dəki bölməyə sürüş: ilk dəfə dərhal, sonra yumşaq. Aktiv düyməni scroll-spy yeniləyir.
  useEffect(() => {
    if (!exists) return
    scrollToSection(slug, scrolledOnce.current)
    scrolledOnce.current = true
  }, [slug, exists])

  // Düyməyə klik: dərhal aktiv et, sürüşmə bitənə qədər scroll-spy-ı saxla
  const selectSection = (target) => {
    lockUntil.current = Date.now() + SCROLL_LOCK_MS
    setActiveSlug(target)
    scrollToSection(target, true)
  }

  // Scroll-spy: yapışqan zolağın altından keçən son bölmə aktivdir
  useEffect(() => {
    if (!sections.length) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      if (Date.now() < lockUntil.current) return
      const offset = (stickyRef.current?.getBoundingClientRect().bottom ?? 0) + 8
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      let current = sections[0].slug
      if (atBottom) {
        current = sections[sections.length - 1].slug
      } else {
        for (const c of sections) {
          const el = document.getElementById(sectionId(c.slug))
          if (el && el.getBoundingClientRect().top - offset <= 1) current = c.slug
        }
      }
      setActiveSlug(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [sections])

  const tabs = sections.map((c) => ({ slug: c.slug, label: localize(c.name, lang) }))

  let content
  if (isLoading) {
    content = <Loading />
  } else if (error && !data) {
    content = (
      <ErrorState
        description={
          isNetworkError(error)
            ? t('common:networkError')
            : getErrorMessage(error, t('common:errorDescription'))
        }
        onRetry={refetch}
      />
    )
  } else if (!sections.length) {
    content = <EmptyState description={t('menuEmpty')} />
  } else if (!exists) {
    content = (
      <Result
        status="404"
        title={t('categoryNotFound')}
        subTitle={t('categoryNotFoundDescription')}
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            {t('common:backHome')}
          </Button>
        }
      />
    )
  } else {
    content = (
      <>
        <div ref={stickyRef} className="pm-menu-sticky">
          <CategoryTabs
            categories={tabs}
            activeSlug={activeSlug}
            onSelect={selectSection}
          />
        </div>
        {sections.map((c) => (
          <MenuSection
            key={c._id || c.slug}
            id={sectionId(c.slug)}
            title={localize(c.name, lang)}
            items={c.items || []}
            lang={lang}
          />
        ))}
      </>
    )
  }

  return (
    <div className="pm-menu">
      <div className="pm-menu-head">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          aria-label={t('common:back')}
        />
        <h1 className="pm-menu-title">{t('menuTitle')}</h1>
        <span aria-hidden="true" style={{ width: 32 }} />
      </div>
      {content}
    </div>
  )
}
