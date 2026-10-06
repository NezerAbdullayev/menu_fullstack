import { useTranslation } from 'react-i18next'
import { formatPrice } from '../../utils/format'
import MediaImage from './MediaImage'
import './public.css'

/** Məhsul sətri: kiçik şəkil (varsa), ad, qısa təsvir, qiymət. Klik yoxdur. */
export default function ItemCard({ name, description, price, image, isAvailable = true }) {
  const { t } = useTranslation('public')
  const unavailable = isAvailable === false

  return (
    <article
      className={`pm-item${unavailable ? ' pm-item-unavailable' : ''}`}
      aria-disabled={unavailable || undefined}
    >
      {image ? (
        <div className="pm-item-thumb">
          <MediaImage src={image} alt={name} ratio="1 / 1" />
        </div>
      ) : null}
      <div className="pm-item-body">
        <div className="pm-item-name pm-clamp-2">{name}</div>
        {description ? (
          <div className="pm-item-desc pm-clamp-2" title={description}>
            {description}
          </div>
        ) : null}
        <div className="pm-item-price">
          {formatPrice(price)}
          {unavailable ? <span className="pm-item-badge">{t('unavailable')}</span> : null}
        </div>
      </div>
    </article>
  )
}
