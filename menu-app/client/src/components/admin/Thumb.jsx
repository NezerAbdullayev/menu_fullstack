import { Image } from 'antd'
import { PictureOutlined } from '@ant-design/icons'

/** Cədvəl üçün kiçik şəkil miniatürü, şəkil yoxdursa ikon. */
export default function Thumb({ src, size = 48 }) {
  if (!src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 6,
          background: 'rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(0,0,0,0.25)',
          fontSize: size / 2.4,
        }}
      >
        <PictureOutlined />
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      style={{ objectFit: 'cover', borderRadius: 6 }}
    />
  )
}
