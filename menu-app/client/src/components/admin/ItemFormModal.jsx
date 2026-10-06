import { App, Col, Form, InputNumber, Modal, Row, Select, Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCreateItemMutation, useUpdateItemMutation } from '../../features/api/apiSlice'
import { getErrorFields, getErrorMessage, isNetworkError } from '../../utils/errors'
import { localize } from '../../utils/localize'
import { currentLang } from '../../i18n'
import ImageUpload from './ImageUpload'
import LocalizedInputs from './LocalizedInputs'
import { applyServerErrors, normalizeLocalized, toItemBody } from './formUtils'

/**
 * Məhsul yaratmaq/redaktə etmək üçün modal.
 * record: redaktə olunan məhsul (category populate olunmuş ola bilər).
 * categories: admin bölmələri (itemCount ilə). defaultCategory: yeni məhsul üçün seçilmiş bölmə.
 */
export default function ItemFormModal({ open, record, categories = [], defaultCategory, onClose }) {
  const { t } = useTranslation('admin')
  const { message } = App.useApp()
  const lang = currentLang()
  const [form] = Form.useForm()
  const [createItem, createState] = useCreateItemMutation()
  const [updateItem, updateState] = useUpdateItemMutation()
  const saving = createState.isLoading || updateState.isLoading
  const isEdit = Boolean(record?._id)

  const recordCategory =
    record?.category && typeof record.category === 'object' ? record.category._id : record?.category

  const initialValues = {
    category: recordCategory || defaultCategory || undefined,
    name: normalizeLocalized(record?.name),
    description: normalizeLocalized(record?.description),
    price: record ? record.price : undefined,
    image: record?.image || '',
    isAvailable: record ? record.isAvailable !== false : true,
  }

  const onFinish = async (values) => {
    let order = record?.order ?? 0
    // Yeni məhsul (və ya başqa bölməyə köçən) siyahının sonuna düşür.
    if (!isEdit || values.category !== recordCategory) {
      order = categories.find((c) => c._id === values.category)?.itemCount ?? 0
    }
    const body = toItemBody({ ...values, order })
    try {
      if (isEdit) {
        await updateItem({ id: record._id, ...body }).unwrap()
        message.success(t('items.updated'))
      } else {
        await createItem(body).unwrap()
        message.success(t('items.created'))
      }
      onClose()
    } catch (err) {
      applyServerErrors(form, getErrorFields(err))
      message.error(isNetworkError(err) ? t('common:networkError') : getErrorMessage(err, t('saveFailed')))
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? t('items.editTitle') : t('items.createTitle')}
      okText={t('common:save')}
      cancelText={t('common:cancel')}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={saving}
      destroyOnHidden
      width={760}
      style={{ top: 24 }}
      mask={{ closable: !saving }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
        disabled={saving}
        requiredMark="optional"
      >
        <Row gutter={12}>
          <Col xs={24} md={14}>
            <Form.Item
              name="category"
              label={t('fields.category')}
              rules={[{ required: true, message: t('validation.categoryRequired') }]}
            >
              <Select
                showSearch={{ optionFilterProp: 'label' }}
                placeholder={t('items.selectCategory')}
                options={categories.map((c) => ({ value: c._id, label: localize(c.name, lang) }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={10}>
            <Form.Item
              name="price"
              label={t('fields.price')}
              rules={[
                { required: true, message: t('validation.priceRequired') },
                { type: 'number', min: 0, message: t('validation.priceMin') },
              ]}
            >
              {/* min qoyulmur: antd mənfi dəyəri səssizcə 0-a çevirirdi, indi validasiya xətası göstərilir */}
              <InputNumber step={0.1} precision={2} suffix="₼" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <LocalizedInputs name="name" label={t('fields.name')} requiredAz maxLength={120} />
        <LocalizedInputs name="description" label={t('fields.description')} textarea maxLength={1000} />
        <Row gutter={12}>
          <Col xs={24} md={16}>
            <Form.Item name="image" label={t('fields.image')}>
              <ImageUpload />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="isAvailable" label={t('fields.available')} valuePropName="checked">
              <Switch
                checkedChildren={t('status.available')}
                unCheckedChildren={t('status.unavailable')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
