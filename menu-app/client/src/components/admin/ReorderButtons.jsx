import { Button, Space, Tooltip } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

/** Sıra dəyişmək üçün yuxarı/aşağı düymələri. */
export default function ReorderButtons({ index, total, onMove, disabled, loading }) {
  const { t } = useTranslation('admin')
  return (
    <Space size={4}>
      <Tooltip title={t('reorder.up')}>
        <Button
          size="small"
          icon={<ArrowUpOutlined />}
          aria-label={t('reorder.up')}
          disabled={disabled || index === 0}
          loading={loading === 'up'}
          onClick={() => onMove(index, -1)}
        />
      </Tooltip>
      <Tooltip title={t('reorder.down')}>
        <Button
          size="small"
          icon={<ArrowDownOutlined />}
          aria-label={t('reorder.down')}
          disabled={disabled || index >= total - 1}
          loading={loading === 'down'}
          onClick={() => onMove(index, 1)}
        />
      </Tooltip>
    </Space>
  )
}
