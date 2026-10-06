import { Segmented } from 'antd'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, currentLang } from '../i18n'

/**
 * az/en/ru seçimi.
 * Qısa kodlarla Segmented (tam ad title-da). Əvvəlki variant="select" istifadə olunmurdu və
 * antd Select-i (~78 kB) müştəri menyusunun ilk yüklənən JS-inə daxil edirdi, ona görə çıxarıldı.
 */
export default function LangSwitcher({ size = 'middle', style }) {
  const { t, i18n } = useTranslation('common')
  const value = currentLang()
  const change = (lng) => i18n.changeLanguage(lng)

  return (
    <Segmented
      size={size}
      value={value}
      onChange={change}
      style={style}
      aria-label={t('language')}
      options={LANGUAGES.map((lng) => ({
        value: lng,
        label: <span title={t(`languages.${lng}`)}>{t(`languageShort.${lng}`)}</span>,
      }))}
    />
  )
}
