import { Button, Card, Col, Flex, Row, Statistic, Typography } from 'antd'
import {
  AppstoreOutlined,
  ExportOutlined,
  ShoppingOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGetStatsQuery } from '../../features/api/apiSlice'
import { useAuth } from '../../hooks/useAuth'
import { ErrorState } from '../../components/PageState'
import { isNetworkError } from '../../utils/errors'

export default function DashboardPage() {
  const { t } = useTranslation('admin')
  const navigate = useNavigate()
  const { admin } = useAuth()
  const { data, isLoading, isError, error, refetch } = useGetStatsQuery()

  const cards = [
    {
      key: 'categories',
      title: t('dashboard.stats.categories'),
      value: data?.categories,
      icon: <AppstoreOutlined />,
      to: '/admin/categories',
    },
    {
      key: 'items',
      title: t('dashboard.stats.items'),
      value: data?.items,
      icon: <ShoppingOutlined />,
      to: '/admin/items',
    },
    {
      key: 'unavailable',
      title: t('dashboard.stats.unavailable'),
      value: data?.unavailable,
      icon: <StopOutlined />,
      to: '/admin/items',
    },
  ]

  return (
    <div>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        {t('common:nav.dashboard')}
      </Typography.Title>
      {admin?.email && (
        <Typography.Paragraph type="secondary">
          {t('dashboard.welcome', { email: admin.email })}
        </Typography.Paragraph>
      )}

      {isError ? (
        <Card>
          <ErrorState
            description={isNetworkError(error) ? t('common:networkError') : undefined}
            onRetry={refetch}
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {cards.map((c) => (
            <Col key={c.key} xs={24} sm={8}>
              <Link to={c.to}>
                <Card hoverable loading={isLoading}>
                  <Statistic title={c.title} value={c.value ?? 0} prefix={c.icon} />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}

      <Card title={t('dashboard.quickLinks')} style={{ marginTop: 16 }}>
        <Flex gap={12} wrap>
          <Button icon={<AppstoreOutlined />} onClick={() => navigate('/admin/categories')}>
            {t('dashboard.manageCategories')}
          </Button>
          <Button icon={<ShoppingOutlined />} onClick={() => navigate('/admin/items')}>
            {t('dashboard.manageItems')}
          </Button>
          <Button href="/" target="_blank" rel="noopener noreferrer" icon={<ExportOutlined />}>
            {t('dashboard.viewSite')}
          </Button>
        </Flex>
      </Card>
    </div>
  )
}
