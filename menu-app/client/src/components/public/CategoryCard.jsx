import { Typography } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import MediaImage from './MediaImage'
import './public.css'

/** Ana səhifədə bir bölmə kartı. Klik -> /menu/:slug */
export default function CategoryCard({ name, slug, image }) {
  return (
    <Link to={`/menu/${encodeURIComponent(slug)}`} className="pm-card">
      <MediaImage src={image} alt={name} ratio="4 / 3" icon={<AppstoreOutlined />} />
      <div className="pm-card-body">
        <Typography.Text strong className="pm-clamp-2" style={{ fontSize: 15, lineHeight: 1.35 }}>
          {name}
        </Typography.Text>
      </div>
    </Link>
  )
}
