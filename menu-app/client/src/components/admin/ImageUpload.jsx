import { App, Button, Flex, Image, Typography, Upload } from 'antd'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useUploadImageMutation } from '../../features/api/apiSlice'
import { getErrorMessage, isNetworkError } from '../../utils/errors'

const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

/**
 * Form üçün kontrollu şəkil sahəsi.
 * value: şəklin url-i ('/uploads/...') və ya boş sətir. onChange(url).
 */
export default function ImageUpload({ value, onChange, disabled }) {
  const { t } = useTranslation('admin')
  const { message } = App.useApp()
  const [uploadImage, { isLoading }] = useUploadImageMutation()

  const beforeUpload = (file) => {
    if (!ACCEPT_TYPES.includes(file.type)) {
      message.error(t('upload.invalidType'))
      return Upload.LIST_IGNORE
    }
    if (file.size > MAX_SIZE) {
      message.error(t('upload.tooLarge'))
      return Upload.LIST_IGNORE
    }
    return true
  }

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const res = await uploadImage(file).unwrap()
      onChange?.(res.url)
      onSuccess?.(res)
    } catch (err) {
      message.error(
        isNetworkError(err) ? t('common:networkError') : getErrorMessage(err, t('upload.failed')),
      )
      onError?.(err)
    }
  }

  return (
    <Flex gap={12} align="center" wrap>
      {value ? (
        <Image
          src={value}
          alt=""
          width={96}
          height={96}
          style={{ objectFit: 'cover', borderRadius: 8 }}
        />
      ) : (
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 8,
            border: '1px dashed #d9d9d9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 4,
          }}
        >
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {t('upload.noImage')}
          </Typography.Text>
        </div>
      )}
      <Flex vertical gap={8}>
        <Upload
          accept=".jpg,.jpeg,.png,.webp"
          showUploadList={false}
          maxCount={1}
          beforeUpload={beforeUpload}
          customRequest={customRequest}
          disabled={disabled || isLoading}
        >
          <Button icon={<UploadOutlined />} loading={isLoading} disabled={disabled}>
            {value ? t('upload.change') : t('upload.button')}
          </Button>
        </Upload>
        {value && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onChange?.('')}
            disabled={disabled || isLoading}
          >
            {t('upload.remove')}
          </Button>
        )}
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {t('upload.hint')}
        </Typography.Text>
      </Flex>
    </Flex>
  )
}
