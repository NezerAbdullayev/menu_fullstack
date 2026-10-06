import { Col, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useGetCategoriesQuery } from '../../features/api/apiSlice'
import { EmptyState, ErrorState, Loading } from '../../components/PageState'
import CategoryCard from '../../components/public/CategoryCard'
import { getErrorMessage, isNetworkError } from '../../utils/errors'
import { localize } from '../../utils/localize'

/** Ana səhifə (/): aktiv bölmələrin kart şəbəkəsi. */
export default function MenuPage() {
  const { t, i18n } = useTranslation('public')
  const lang = (i18n.resolvedLanguage || 'az').slice(0, 2)
  const { data, isLoading, isFetching, error, refetch } = useGetCategoriesQuery()

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
  } else if (!data?.length) {
    content = <EmptyState description={t('menuEmpty')} />
  } else {
    content = (
      <Row gutter={[12, 12]} style={{ opacity: isFetching ? 0.7 : 1, transition: 'opacity 0.2s' }}>
        {data.map((cat) => (
          <Col key={cat._id || cat.slug} xs={12} sm={8} md={6}>
            <CategoryCard name={localize(cat.name, lang)} slug={cat.slug} image={cat.image} />
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {t('menuTitle')}
        </Typography.Title>
        <Typography.Text type="secondary">{t('menuSubtitle')}</Typography.Text>
      </div>
      {content}
    </div>
  )
}
