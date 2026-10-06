import { useEffect } from 'react'
import { ConfigProvider, Layout, Typography, theme } from 'antd'
import { Link, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LangSwitcher from '../components/LangSwitcher'
import '../components/public/public.css'

const { Header, Content, Footer } = Layout

// Public menyu tünd temadadır, admin açıq qalır (bu ConfigProvider yalnız public hissəni əhatə edir).
const DARK_THEME = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorBgLayout: '#0f0f0f',
    colorBgContainer: '#161616',
    colorText: '#f8fafc',
    colorBorderSecondary: '#262626',
  },
}

function PublicShell() {
  const { t } = useTranslation('common')
  const { token } = theme.useToken()

  // Overscroll zamanı açıq body fonu görünməsin
  useEffect(() => {
    document.body.classList.add('pm-dark')
    return () => document.body.classList.remove('pm-dark')
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          paddingInline: 16,
          background: token.colorBgLayout,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Link to="/" style={{ minWidth: 0 }}>
          <Typography.Title
            level={4}
            ellipsis
            style={{ margin: 0, color: token.colorPrimary }}
          >
            {t('siteName')}
          </Typography.Title>
        </Link>
        <LangSwitcher size="small" />
      </Header>

      <Content style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 16 }}>
        <Outlet />
      </Content>

      <Footer
        style={{
          textAlign: 'center',
          padding: '16px',
          background: token.colorBgLayout,
          color: token.colorTextSecondary,
        }}
      >
        {t('footer', { year: new Date().getFullYear(), siteName: t('siteName') })}
      </Footer>
    </Layout>
  )
}

export default function PublicLayout() {
  return (
    <ConfigProvider theme={DARK_THEME}>
      <PublicShell />
    </ConfigProvider>
  )
}
