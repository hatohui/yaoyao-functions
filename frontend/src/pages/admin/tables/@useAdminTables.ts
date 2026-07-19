import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import {
	useGetTables,
	useGetStagedTables,
	useCreateTable,
	useBulkCreateTables,
	useDeleteTable,
	useBulkDeleteTables,
	useReassignTables,
	getGetTablesQueryKey,
	getGetStagedTablesQueryKey,
} from '@/api/tables/tables'
import type { TableDto, TableListDto } from '@/api/model'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useToast } from '@/hooks/useToast'

export function useAdminTables() {
	const { t } = useTranslation()
	const toast = useToast()
	const qc = useQueryClient()

	const [search, setSearch] = useState('')
	const [total, setTotal] = useState(0)
	const debouncedSearch = useDebounce(search, 300)
	const pagination = usePagination({ total, initialCount: 12 })

	const { data, isLoading: liveLoading } = useGetTables<TableListDto>({
		page: pagination.page,
		count: pagination.count,
		search: debouncedSearch || undefined,
	})
	const liveTables = data?.tables ?? []

	useEffect(() => {
		if (data?.total !== undefined) setTotal(data.total)
	}, [data?.total])

	const { data: stagedTables = [], isLoading: stagedLoading } =
		useGetStagedTables<TableDto[]>()

	const invalidate = () => {
		qc.invalidateQueries({ queryKey: getGetTablesQueryKey() })
		qc.invalidateQueries({ queryKey: getGetStagedTablesQueryKey() })
	}

	const { mutate: createTable, isPending: creating } = useCreateTable({
		mutation: {
			onSuccess: () => {
				invalidate()
				toast.success(t('admin.tables.created'))
			},
			onError: () => toast.error(t('admin.tables.create_failed')),
		},
	})

	const { mutate: bulkCreate, isPending: bulkCreating } = useBulkCreateTables({
		mutation: {
			onSuccess: () => {
				invalidate()
				toast.success(t('admin.tables.bulk_created'))
			},
			onError: () => toast.error(t('admin.tables.create_failed')),
		},
	})

	const { mutate: deleteTable } = useDeleteTable({
		mutation: {
			onSuccess: () => {
				invalidate()
				toast.success(t('admin.tables.deleted'))
			},
			onError: () => toast.error(t('admin.tables.delete_failed')),
		},
	})

	const { mutate: bulkDelete } = useBulkDeleteTables({
		mutation: {
			onSuccess: () => {
				invalidate()
				toast.success(t('admin.tables.deleted'))
			},
			onError: () => toast.error(t('admin.tables.delete_failed')),
		},
	})

	const { mutate: reassign } = useReassignTables({
		mutation: {
			onSuccess: () => {
				invalidate()
				toast.success(t('admin.tables.moved_to_staging'))
			},
			onError: () => toast.error(t('admin.tables.delete_failed')),
		},
	})

	return {
		search,
		setSearch,
		pagination,
		liveTables,
		liveLoading,
		stagedTables,
		stagedLoading,
		creating,
		bulkCreating,
		createTable: (name: string, capacity: number, isStaging: boolean) =>
			createTable({ data: { name, capacity, isStaging } }),
		bulkCreate: (count: number, capacity: number, isStaging: boolean) =>
			bulkCreate({ data: { count, capacity, isStaging } }),
		removeTable: (id: string) => deleteTable({ id }),
		bulkRemoveTables: (ids: string[]) => bulkDelete({ data: { ids } }),
		moveToStaging: (ids: string[]) =>
			reassign({ data: { ids, eventId: null } }),
	}
}
