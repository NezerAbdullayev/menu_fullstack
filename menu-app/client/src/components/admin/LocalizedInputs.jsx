import { Col, Form, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { LANGS } from './formUtils'

/**
 * Bir lokallaşdırılmış sahə üçün az/en/ru xanaları.
 * name: form sahəsinin adı ('name', 'description'). az mütləq ola bilər (requiredAz).
 */
export default function LocalizedInputs({ name, label, requiredAz = false, textarea = false, maxLength }) {
  const { t } = useTranslation('admin')
  const Field = textarea ? Input.TextArea : Input

  return (
    <Row gutter={12}>
      {LANGS.map((lng) => (
        <Col key={lng} xs={24} md={textarea ? 24 : 8}>
          <Form.Item
            name={[name, lng]}
            label={`${label} (${t(`common:languageShort.${lng}`)})`}
            rules={
              lng === 'az' && requiredAz
                ? [{ required: true, whitespace: true, message: t('validation.azRequired') }]
                : []
            }
          >
            <Field
              maxLength={maxLength}
              {...(textarea ? { autoSize: { minRows: 2, maxRows: 5 } } : {})}
            />
          </Form.Item>
        </Col>
      ))}
    </Row>
  )
}
