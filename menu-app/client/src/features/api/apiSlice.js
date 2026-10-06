import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logout, setAdmin, setCredentials } from '../auth/authSlice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

// 401 gələndə sessiya bitib: çıxış et. Login sorğusunda 401 yanlış parol deməkdir.
const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)
  const url = typeof args === 'string' ? args : args.url
  if (result.error?.status === 401 && !url.startsWith('/auth/login')) {
    api.dispatch(logout())
  }
  return result
}

// Admin dəyişiklikləri bu tag-ləri etibarsız edir, siyahılar və statistika özü yenilənir.
const CATEGORY = 'Category'
const ITEM = 'Item'
const STATS = 'Stats'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [CATEGORY, ITEM, STATS],
  endpoints: (build) => ({
    // Public
    getMenu: build.query({
      query: () => '/menu',
      providesTags: [CATEGORY, ITEM],
    }),
    getCategories: build.query({
      query: () => '/categories',
      providesTags: [CATEGORY],
    }),
    getCategoryItems: build.query({
      query: (slug) => `/categories/${encodeURIComponent(slug)}/items`,
      providesTags: [CATEGORY, ITEM],
    }),

    // Auth
    login: build.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch {
          // xəta komponentdə göstərilir
        }
      },
    }),
    me: build.query({
      query: () => '/auth/me',
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setAdmin(data.admin))
        } catch {
          // 401 halında baseQuery artıq çıxış edir. Şəbəkə xətasında tokeni saxlayırıq.
        }
      },
    }),

    // Admin
    getStats: build.query({
      query: () => '/admin/stats',
      providesTags: [STATS],
    }),

    getAdminCategories: build.query({
      query: () => '/admin/categories',
      providesTags: [CATEGORY, ITEM],
    }),
    getAdminCategory: build.query({
      query: (id) => `/admin/categories/${id}`,
      providesTags: [CATEGORY],
    }),
    createCategory: build.mutation({
      query: (body) => ({ url: '/admin/categories', method: 'POST', body }),
      invalidatesTags: [CATEGORY, STATS],
    }),
    updateCategory: build.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/categories/${id}`, method: 'PUT', body }),
      invalidatesTags: [CATEGORY, STATS],
    }),
    deleteCategory: build.mutation({
      query: (id) => ({ url: `/admin/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: [CATEGORY, STATS],
    }),

    getAdminItems: build.query({
      // categoryId verilməsə bütün məhsullar
      query: (categoryId) => ({
        url: '/admin/items',
        params: categoryId ? { category: categoryId } : undefined,
      }),
      providesTags: [ITEM],
    }),
    getAdminItem: build.query({
      query: (id) => `/admin/items/${id}`,
      providesTags: [ITEM],
    }),
    createItem: build.mutation({
      query: (body) => ({ url: '/admin/items', method: 'POST', body }),
      invalidatesTags: [ITEM, STATS],
    }),
    updateItem: build.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/items/${id}`, method: 'PUT', body }),
      invalidatesTags: [ITEM, STATS],
    }),
    deleteItem: build.mutation({
      query: (id) => ({ url: `/admin/items/${id}`, method: 'DELETE' }),
      invalidatesTags: [ITEM, STATS],
    }),

    // { type: 'category' | 'item', ids: [...] }
    reorder: build.mutation({
      query: (body) => ({ url: '/admin/reorder', method: 'PATCH', body }),
      invalidatesTags: (result, error, arg) => [arg.type === 'category' ? CATEGORY : ITEM],
    }),

    // File -> { url: '/uploads/...' }
    uploadImage: build.mutation({
      query: (file) => {
        const body = new FormData()
        body.append('image', file)
        return { url: '/admin/upload', method: 'POST', body }
      },
    }),
  }),
})

export const {
  useGetMenuQuery,
  useGetCategoriesQuery,
  useGetCategoryItemsQuery,
  useLoginMutation,
  useMeQuery,
  useGetStatsQuery,
  useGetAdminCategoriesQuery,
  useGetAdminCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAdminItemsQuery,
  useGetAdminItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useReorderMutation,
  useUploadImageMutation,
} = apiSlice
