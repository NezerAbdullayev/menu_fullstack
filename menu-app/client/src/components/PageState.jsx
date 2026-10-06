import { Button, Empty as AntEmpty, Result, Spin } from 'antd'
import { useTranslation } from 'react-i18next'

/** Yüklənmə göstəricisi. description: mətn (default common:loading), fullscreen: ekranın ortasında. */
export function Loading({ description, fullscreen = false }) {
  const { t } = useTranslation('common')
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        minHeight: fullscreen ? '100vh' : 200,
      }}
    >
      <Spin size="large" description={description ?? t('loading')} />
    </div>
  )
}

/** Xəta vəziyyəti. onRetry verilərsə "Yenidən cəhd et" düyməsi görünür. */
export function ErrorState({ title, description, onRetry, extra }) {
  const { t } = useTranslation('common')
  return (
    <Result
      status="error"
      title={title ?? t('error')}
      subTitle={description ?? t('errorDescription')}
      extra={
        extra ??
        (onRetry ? (
          <Button type="primary" onClick={onRetry}>
            {t('retry')}
          </Button>
        ) : null)
      }
    />
  )
}

/** Boş vəziyyət. */
export function EmptyState({ description, children }) {
  const { t } = useTranslation('common')
  return (
    <div style={{ padding: 48 }}>
      <AntEmpty description={description ?? t('empty')}>{children}</AntEmpty>
    </div>
  )
}

// Qısa adlar
export { ErrorState as Error, EmptyState as Empty }

const PageState = { Loading, Error: ErrorState, Empty: EmptyState }
export default PageState
