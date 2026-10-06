import { useTranslation } from 'react-i18next'
import ItemCard from './ItemCard'
import { localize } from '../../utils/localize'
import './public.css'

/** Bir bölmə: çərçivəli başlıq zolağı + iki sütunlu məhsul siyahısı. */
export default function MenuSection({ id, title, items, lang }) {
  const { t } = useTranslation('public')

  return (
    <section id={id} className="pm-section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="pm-section-title">
        {title}
      </h2>
      {items.length ? (
        <div className="pm-items">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              name={localize(item.name, lang)}
              description={localize(item.description, lang)}
              price={item.price}
              image={item.image}
              isAvailable={item.isAvailable}
            />
          ))}
        </div>
      ) : (
        <p className="pm-section-empty">{t('categoryEmpty')}</p>
      )}
    </section>
  )
}
