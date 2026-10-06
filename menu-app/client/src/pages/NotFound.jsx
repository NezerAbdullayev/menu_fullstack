import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation('common')
  return (
    <Result
      status="404"
      title="404"
      subTitle={
        <>
          <div style={{ fontWeight: 600 }}>{t('notFound')}</div>
          <div>{t('notFoundDescription')}</div>
        </>
      }
      extra={
        <Link to="/">
          <Button type="primary">{t('backHome')}</Button>
        </Link>
      }
    />
  )
}
