import { useState } from 'react'
import { App, Button, Card, Flex, Popconfirm, Space, Switch, Table, Tag, Tooltip, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  useDeleteCategoryMutation,
  useGetAdminCategoriesQuery,
  useReorderMutation,
  useUpdateCategoryMutation,
} from '../../features/api/apiSlice'
import { ErrorState } from '../../components/PageState'
import { getErrorMessage, isNetworkError } from '../../utils/errors'
import CategoryFormModal from '../../components/admin/CategoryFormModal'
import ReorderButtons from '../../components/admin/ReorderButtons'
import Thumb from '../../components/admin/Thumb'
import LocalizedName from '../../components/admin/LocalizedName'
import { moveId, toCategoryBody } from '../../components/admin/formUtils'

export default function CategoriesPage() {
  const { t } = useTranslation('admin')
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { data: categories = [], isLoading, isFetching, isError, error, refetch } =
    useGetAdminCategoriesQuery()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [reorder, { isLoading: reordering }] = useReorderMutation()

  const [modal, setModal] = useState({ open: false, record: null })
  const [toggling, setToggling] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [moving, setMoving] = useState(null) // { id, dir }

  const errorText = (err, fallback) =>
    isNetworkError(err) ? t('common:networkError') : getErrorMessage(err, fallback)

  const nextOrder = categories.reduce((max, c) => Math.max(max, (c.order ?? 0) + 1), 0)

  const onMove = async (index, delta) => {
    const ids = moveId(
      categories.map((c) => c._id),
      index,
      delta,
    )
    if (!ids) return
    setMoving({ id: categories[index]._id, dir: delta < 0 ? 'up' : 'down' })
    try {
      await reorder({ type: 'category', ids }).unwrap()
    } catch (err) {
      message.error(errorText(err, t('reorder.failed')))
    } finally {
      setMoving(null)
    }
  }

  const onToggleActive = async (record, checked) => {
    setToggling(record._id)
    try {
      await updateCategory({ id: record._id, ...toCategoryBody(record, { isActive: checked }) }).unwrap()
      message.success(checked ? t('categories.activated') : t('categories.deactivated'))
    } catch (err) {
      message.error(errorText(err, t('saveFailed')))
    } finally {
      setToggling(null)
    }
  }

  const onDelete = async (record) => {
    setDeleting(record._id)
    try {
      await deleteCategory(record._id).unwrap()
      message.success(t('categories.deleted'))
    } catch (err) {
      if (err?.status === 409) {
        message.error(t('categories.hasItems', { count: record.itemCount || 0 }))
      } else {
        message.error(errorText(err, t('deleteFailed')))
      }
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
        <ReorderButtons
          index={index}
          total={categories.length}
          onMove={onMove}
          disabled={reordering || isFetching}
          loading={moving?.id === record._id ? moving.dir : null}
        />
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
      title: t('fields.slug'),
      dataIndex: 'slug',
      key: 'slug',
      responsive: ['md'],
      render: (slug) => <Typography.Text code>{slug}</Typography.Text>,
    },
    {
      title: t('fields.itemCount'),
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 110,
      align: 'center',
      render: (count, record) => (
        <Tooltip title={t('categories.showItems')}>
          <Tag
            color={count ? 'blue' : 'default'}
            style={{ cursor: 'pointer', marginInlineEnd: 0 }}
            onClick={() => navigate(`/admin/items?category=${record._id}`)}
          >
            {count || 0}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: t('fields.active'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive, record) => (
        <Switch
          checked={isActive !== false}
          loading={toggling === record._id}
          onChange={(checked) => onToggleActive(record, checked)}
          aria-label={t('fields.active')}
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
            title={t('categories.deleteConfirm')}
            description={
              record.itemCount ? t('categories.hasItems', { count: record.itemCount }) : undefined
            }
            okText={t('common:delete')}
            cancelText={t('common:cancel')}
            okButtonProps={{ danger: true, disabled: Boolean(record.itemCount) }}
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
          {t('common:nav.categories')}
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModal({ open: true, record: null })}
        >
          {t('categories.add')}
        </Button>
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
            dataSource={categories}
            loading={isLoading}
            pagination={false}
            scroll={{ x: 720 }}
            locale={{ emptyText: t('categories.empty') }}
          />
        )}
      </Card>

      <CategoryFormModal
        key={modal.record?._id || 'new'}
        open={modal.open}
        record={modal.record}
        nextOrder={nextOrder}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
      />
    </div>
  )
}
