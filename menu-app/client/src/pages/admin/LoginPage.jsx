import { useState } from 'react'
import { Alert, Button, Card, Flex, Form, Input, Typography, theme } from 'antd'
import { HomeOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import LangSwitcher from '../../components/LangSwitcher'
import { getErrorMessage, isNetworkError } from '../../utils/errors'

/** ProtectedRoute-un verdiyi state.from-dan qayıdış yolu. */
function redirectTarget(state) {
  const from = state?.from
  if (from?.pathname && from.pathname.startsWith('/admin') && from.pathname !== '/admin/login') {
    return `${from.pathname}${from.search || ''}${from.hash || ''}`
  }
  return '/admin'
}

function loginErrorText(err, t) {
  if (isNetworkError(err)) return t('common:networkError')
  if (err?.status === 401) return t('login.invalid')
  if (err?.status === 429) return t('login.tooMany')
  if (err?.status === 400) return t('login.invalidData')
  return getErrorMessage(err, t('common:error'))
}

export default function LoginPage() {
  const { t } = useTranslation('admin')
  const { token } = theme.useToken()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Uğurlu girişdən sonra da bu yönləndirmə işləyir (token store-a yazılanda).
  if (isAuthenticated) {
    return <Navigate to={redirectTarget(location.state)} replace />
  }

  const onFinish = async ({ email, password }) => {
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      setError(loginErrorText(err, t))
      setSubmitting(false)
    }
  }

  return (
    <Flex
      vertical
      align="center"
      style={{ minHeight: '100vh', padding: 16, background: token.colorBgLayout }}
    >
      <Flex justify="space-between" align="center" style={{ width: '100%', maxWidth: 400 }}>
        <Button type="text" icon={<HomeOutlined />} onClick={() => navigate('/')}>
          {t('login.backToSite')}
        </Button>
        <LangSwitcher size="small" />
      </Flex>

      <Flex flex={1} align="center" justify="center" style={{ width: '100%' }}>
        <Card style={{ width: '100%', maxWidth: 400 }}>
          <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4, textAlign: 'center' }}>
            {t('login.title')}
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ textAlign: 'center' }}>
            {t('login.subtitle')}
          </Typography.Paragraph>

          {error && (
            <Alert
              type="error"
              showIcon
              title={error}
              style={{ marginBottom: 16 }}
              closable={{ onClose: () => setError('') }}
            />
          )}

          <Form layout="vertical" onFinish={onFinish} disabled={submitting} requiredMark={false}>
            <Form.Item
              name="email"
              label={t('login.email')}
              rules={[
                { required: true, message: t('login.emailRequired') },
                { type: 'email', message: t('login.emailInvalid') },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                type="email"
                autoComplete="username"
                inputMode="email"
                autoFocus
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label={t('login.password')}
              rules={[{ required: true, message: t('login.passwordRequired') }]}
            >
              <Input.Password prefix={<LockOutlined />} autoComplete="current-password" size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
              {t('login.submit')}
            </Button>
          </Form>
        </Card>
      </Flex>
    </Flex>
  )
}
