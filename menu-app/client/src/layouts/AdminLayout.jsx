import { Suspense, useState } from 'react'
import { Button, Grid, Layout, Menu, Typography, theme } from 'antd'
import {
  AppstoreOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import LangSwitcher from '../components/LangSwitcher'
import { Loading } from '../components/PageState'

const { Header, Sider, Content } = Layout

function selectedKey(pathname) {
  if (pathname.startsWith('/admin/categories')) return '/admin/categories'
  if (pathname.startsWith('/admin/items')) return '/admin/items'
  return '/admin'
}

export default function AdminLayout() {
  const { t } = useTranslation('common')
  const { token } = theme.useToken()
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.lg
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { admin, logout } = useAuth()

  const items = [
    { key: '/admin', icon: <DashboardOutlined />, label: t('nav.dashboard') },
    { key: '/admin/categories', icon: <AppstoreOutlined />, label: t('nav.categories') },
    { key: '/admin/items', icon: <ShoppingOutlined />, label: t('nav.items') },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: t('nav.logout'), danger: true },
  ]

  const onMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout()
      navigate('/admin/login', { replace: true })
    } else {
      navigate(key)
    }
    if (isMobile) setCollapsed(true)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        onBreakpoint={(broken) => setCollapsed(broken)}
        trigger={null}
        width={220}
        style={
          isMobile
            ? { position: 'fixed', insetBlock: 0, insetInlineStart: 0, zIndex: 100 }
            : { position: 'sticky', top: 0, height: '100vh' }
        }
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            paddingInline: 12,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {collapsed && !isMobile ? t('siteName').slice(0, 1) : `${t('siteName')} · ${t('nav.admin')}`}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey(location.pathname)]}
          items={items}
          onClick={onMenuClick}
        />
      </Sider>

      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 99 }}
        />
      )}

      <Layout>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingInline: 16,
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((c) => !c)}
            aria-label="menu"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            {admin?.email && !isMobile && (
              <Typography.Text type="secondary" ellipsis>
                {admin.email}
              </Typography.Text>
            )}
            <LangSwitcher size="small" />
          </div>
        </Header>
        <Content style={{ margin: isMobile ? 12 : 24, minWidth: 0 }}>
          {/* Səhifə chunk-ı yüklənərkən menyu və başlıq yerində qalır */}
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  )
}
