import { useState } from 'react'
import { PictureOutlined } from '@ant-design/icons'
import './public.css'

/**
 * Sabit nisbətli şəkil sahəsi. Şəkil yoxdursa və ya yüklənmirsə sadə placeholder.
 * ratio: CSS aspect-ratio dəyəri, məs. "4 / 3".
 */
export default function MediaImage({ src, alt = '', ratio = '4 / 3', icon }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const showImage = Boolean(src) && failedSrc !== src

  return (
    <div className="pm-media" style={{ aspectRatio: ratio }}>
      {showImage ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailedSrc(src)} />
      ) : (
        <div className="pm-media-placeholder" aria-hidden="true">
          {icon ?? <PictureOutlined />}
        </div>
      )}
    </div>
  )
}
