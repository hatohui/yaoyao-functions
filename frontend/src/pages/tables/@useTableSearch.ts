import { useEffect, useState } from 'react'
import { useGetTables } from '@/api/tables/tables'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import type { TableListDto } from '@/api/model'

export function useTableSearch() {
	const [search, setSearch] = useState('')
	const [total, setTotal] = useState(0)
	const debouncedSearch = useDebounce(search, 300)

	const pagination = usePagination({ total, initialCount: 12 })
	const { page, count, setPage } = pagination

	useEffect(() => {
		setPage(1)
	}, [debouncedSearch, setPage])

	const { data, isLoading, isError, refetch } = useGetTables<TableListDto>({
		page,
		count,
		search: debouncedSearch || undefined,
	})

	useEffect(() => {
		if (data?.total !== undefined) setTotal(data.total)
	}, [data?.total])

	return {
		search,
		setSearch,
		tables: data?.tables ?? [],
		isLoading,
		isError,
		refetch,
		pagination,
		total,
	}
}
