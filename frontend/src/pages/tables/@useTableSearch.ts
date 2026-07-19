import { useEffect, useMemo, useState } from 'react'
import { useGetTables } from '@/api/tables/tables'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import type { TableListDto } from '@/api/model'

export type TableFilter = 'all' | 'free' | 'full' | 'hosted'

export function useTableSearch() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<TableFilter>('all')
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

  // Occupancy compares a relation count against a column, which Prisma can't
  // express in a where clause - so this narrows the fetched page, not the query.
  const tables = useMemo(() => {
    const rows = data?.tables ?? []
    switch (filter) {
      case 'free':
        return rows.filter(tb => tb.seated < tb.capacity)
      case 'full':
        return rows.filter(tb => tb.seated >= tb.capacity)
      case 'hosted':
        return rows.filter(tb => Boolean(tb.tableLeaderId))
      default:
        return rows
    }
  }, [data?.tables, filter])

  return {
    search,
    setSearch,
    filter,
    setFilter,
    tables,
    isLoading,
    isError,
    refetch,
    pagination,
    total,
  }
}
