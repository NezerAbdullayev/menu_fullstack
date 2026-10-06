import { useState } from 'react'
import {
  Alert,
  App,
  Button,
  Card,
  Flex,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  useDeleteItemMutation,
  useGetAdminCategoriesQuery,
  useGetAdminItemsQuery,
  useReorderMutation,
  useUpdateItemMutation,
} from '../../features/api/apiSlice'
import { ErrorState } from '../../components/PageState'
import { getErrorMessage, isNetworkError } from '../../utils/errors'
import { formatPrice } from '../../utils/format'
import { localize } from '../../utils/localize'
import { currentLang } from '../../i18n'
import ItemFormModal from '../../components/admin/ItemFormModal'
import ReorderButtons from '../../components/admin/ReorderButtons'
import Thumb from '../../components/admin/Thumb'
import LocalizedName from '../../components/admin/LocalizedName'
import { moveId, toItemBody } from '../../components/admin/formUtils'

export default function ItemsPage() {
  const { t } = useTranslation('admin')
  const { message } = App.useApp()
  const lang = currentLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryId = searchParams.get('category') || undefined

  const { data: categories = [], isLoading: categoriesLoading } = useGetAdminCategoriesQuery()
  const {
    currentData: items = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAdminItemsQuery(categoryId)
  const [updateItem] = useUpdateItemMutation()
  const [deleteItem] = useDeleteItemMutation()
  const [reorder, { isLoading: reordering }] = useReorderMutation()

  const [modal, setModal] = useState({ open: false, record: null })
  const [toggling, setToggling] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [moving, setMoving] = useState(null) // { id, dir }

  const canReorder = Boolean(categoryId)
  const noCategories = !categoriesLoading && categories.length === 0

  const errorText = (err, fallback) =>
    isNetworkError(err) ? t('common:networkError') : getErrorMessage(err, fallback)

  const setCategory = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('category', value)
    else next.delete('category')
    setSearchParams(next, { replace: true })
  }

  const categoryName = (category) => {
    if (category && typeof category === 'object') return localize(category.name, lang)
    const found = categories.find((c) => c._id === category)
    return found ? localize(found.name, lang) : ''
  }

  const onMove = async (index, delta) => {
    if (!canReorder) return
    const ids = moveId(
      items.map((i) => i._id),
      index,
      delta,
    )
    if (!ids) return
    setMoving({ id: items[index]._id, dir: delta < 0 ? 'up' : 'down' })
    try {
      await reorder({ type: 'item', ids }).unwrap()
    } catch (err) {
      message.error(errorText(err, t('reorder.failed')))
    } finally {
      setMoving(null)
    }
  }

  const onToggleAvailable = async (record, checked) => {
    setToggling(record._id)
    try {
      await updateItem({ id: record._id, ...toItemBody(record, { isAvailable: checked }) }).unwrap()
      message.success(checked ? t('items.madeAvailable') : t('items.madeUnavailable'))
    } catch (err) {
      message.error(errorText(err, t('saveFailed')))
    } finally {
      setToggling(null)
    }
  }

  const onDelete = async (record) => {
    setDeleting(record._id)
    try {
      await deleteItem(record._id).unwrap()
      message.success(t('items.deleted'))
    } catch (err) {
      message.error(errorText(err, t('deleteFailed')))
    } finally {
      setDeleting(null)
    }
  }

  const columns = [
    {
      title: t('fields.order'),
      key: 'order',
      width: 90,
      render: (_, record, index) => (
        <Tooltip title={canReorder ? undefined : t('items.reorderHint')}>
          <span>
            <ReorderButtons
              index={index}
              total={items.length}
              onMove={onMove}
              disabled={!canReorder || reordering || isFetching}
              loading={moving?.id === record._id ? moving.dir : null}
            />
          </span>
        </Tooltip>
      ),
    },
    {
      title: t('fields.image'),
      dataIndex: 'image',
      key: 'image',
      width: 72,
      responsive: ['sm'],
      render: (src) => <Thumb src={src} />,
    },
    {
      title: t('fields.name'),
      key: 'name',
      render: (_, record) => <LocalizedName value={record.name} />,
    },
    {
      title: t('fields.category'),
      key: 'category',
      responsive: ['md'],
      render: (_, record) => categoryName(record.category),
    },
    {
      title: t('fields.price'),
      dataIndex: 'price',
      key: 'price',
      width: 110,
      align: 'right',
      render: (price) => <Typography.Text style={{ whiteSpace: 'nowrap' }}>{formatPrice(price)}</Typography.Text>,
    },
    {
      title: t('fields.available'),
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      width: 110,
      render: (isAvailable, record) => (
        <Switch
          checked={isAvailable !== false}
          loading={toggling === record._id}
          onChange={(checked) => onToggleAvailable(record, checked)}
          aria-label={t('fields.available')}
        />
      ),
    },
    {
      title: t('common:actions'),
      key: 'actions',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title={t('common:edit')}>
            <Button
              icon={<EditOutlined />}
              aria-label={t('common:edit')}
              onClick={() => setModal({ open: true, record })}
            />
          </Tooltip>
          <Popconfirm
            title={t('items.deleteConfirm')}
            okText={t('common:delete')}
            cancelText={t('common:cancel')}
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              aria-label={t('common:delete')}
              loading={deleting === record._id}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Flex justify="space-between" align="center" gap={12} wrap style={{ marginBottom: 16 }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          {t('common:nav.items')}
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          disabled={noCategories}
          onClick={() => setModal({ open: true, record: null })}
        >
          {t('items.add')}
        </Button>
      </Flex>

      {noCategories && (
        <Alert type="info" showIcon title={t('items.noCategories')} style={{ marginBottom: 16 }} />
      )}

      <Flex gap={12} align="center" wrap style={{ marginBottom: 16 }}>
        <Select
          style={{ width: '100%', maxWidth: 320 }}
          value={categoryId ?? ''}
          onChange={setCategory}
          loading={categoriesLoading}
          showSearch={{ optionFilterProp: 'label' }}
          aria-label={t('fields.category')}
          options={[
            { value: '', label: t('items.allCategories') },
            ...categories.map((c) => ({
              value: c._id,
              label: `${localize(c.name, lang)} (${c.itemCount || 0})`,
            })),
          ]}
        />
        {!canReorder && items.length > 1 && (
          <Typography.Text type="secondary">{t('items.reorderHint')}</Typography.Text>
        )}
      </Flex>

      <Card styles={{ body: { padding: 0 } }}>
        {isError ? (
          <ErrorState
            description={isNetworkError(error) ? t('common:networkError') : undefined}
            onRetry={refetch}
          />
        ) : (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={items}
            loading={isLoading || (isFetching && items.length === 0)}
            pagination={false}
            scroll={{ x: 760 }}
            locale={{ emptyText: t('items.empty') }}
          />
        )}
      </Card>

      <ItemFormModal
        key={modal.record?._id || `new-${categoryId || ''}`}
        open={modal.open}
        record={modal.record}
        categories={categories}
        defaultCategory={categoryId}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
      />
    </div>
  )
}
