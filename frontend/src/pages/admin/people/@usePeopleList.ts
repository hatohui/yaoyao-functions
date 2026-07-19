import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetPeopleList } from '@/api/stats/stats'
import type { PeopleListDto } from '@/api/model'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'

export function usePeopleList() {
	const { i18n } = useTranslation()
	const [search, setSearch] = useState('')
	const [total, setTotal] = useState(0)
	const debouncedSearch = useDebounce(search, 300)
	const pagination = usePagination({ total, initialCount: 20 })

	const { data, isLoading, isError } = useGetPeopleList<PeopleListDto>({
		page: pagination.page,
		count: pagination.count,
		search: debouncedSearch || undefined,
		lang: i18n.language,
	})

	useEffect(() => {
		if (data?.total !== undefined) setTotal(data.total)
	}, [data?.total])

	return {
		search,
		setSearch,
		pagination,
		people: data?.people ?? [],
		isLoading,
		isError,
	}
}
