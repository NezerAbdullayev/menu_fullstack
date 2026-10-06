import { App, Form, Input, Modal, Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '../../features/api/apiSlice'
import { getErrorFields, getErrorMessage, isNetworkError } from '../../utils/errors'
import ImageUpload from './ImageUpload'
import LocalizedInputs from './LocalizedInputs'
import { applyServerErrors, normalizeLocalized, toCategoryBody } from './formUtils'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Bölmə yaratmaq/redaktə etmək üçün modal.
 * record: redaktə olunan bölmə, yoxdursa yeni bölmə. nextOrder: yeni bölmənin sırası.
 */
export default function CategoryFormModal({ open, record, nextOrder = 0, onClose }) {
  const { t } = useTranslation('admin')
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [createCategory, createState] = useCreateCategoryMutation()
  const [updateCategory, updateState] = useUpdateCategoryMutation()
  const saving = createState.isLoading || updateState.isLoading
  const isEdit = Boolean(record?._id)

  const initialValues = {
    name: normalizeLocalized(record?.name),
    slug: record?.slug || '',
    image: record?.image || '',
    isActive: record ? record.isActive !== false : true,
  }

  const onFinish = async (values) => {
    const body = toCategoryBody({ ...values, order: isEdit ? record.order : nextOrder })
    try {
      if (isEdit) {
        await updateCategory({ id: record._id, ...body }).unwrap()
        message.success(t('categories.updated'))
      } else {
        await createCategory(body).unwrap()
        message.success(t('categories.created'))
      }
      onClose()
    } catch (err) {
      if (err?.status === 409) {
        form.setFields([{ name: 'slug', errors: [t('categories.slugTaken')] }])
        message.error(t('categories.slugTaken'))
        return
      }
      applyServerErrors(form, getErrorFields(err))
      message.error(isNetworkError(err) ? t('common:networkError') : getErrorMessage(err, t('saveFailed')))
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? t('categories.editTitle') : t('categories.createTitle')}
      okText={t('common:save')}
      cancelText={t('common:cancel')}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={saving}
      destroyOnHidden
      width={720}
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
        <LocalizedInputs name="name" label={t('fields.name')} requiredAz maxLength={120} />
        <Form.Item
          name="slug"
          label={t('fields.slug')}
          extra={t('categories.slugHelp')}
          normalize={(v) => (typeof v === 'string' ? v.toLowerCase() : v)}
          rules={[{ pattern: SLUG_PATTERN, message: t('categories.slugInvalid') }]}
        >
          <Input placeholder="salatlar" maxLength={80} />
        </Form.Item>
        <Form.Item name="image" label={t('fields.image')}>
          <ImageUpload />
        </Form.Item>
        <Form.Item name="isActive" label={t('fields.active')} valuePropName="checked">
          <Switch checkedChildren={t('status.active')} unCheckedChildren={t('status.hidden')} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
