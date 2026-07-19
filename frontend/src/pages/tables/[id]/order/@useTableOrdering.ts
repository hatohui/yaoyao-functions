import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useGetFoods } from '@/api/foods/foods'
import { useGetCategories } from '@/api/categories/categories'
import { useGetTableById } from '@/api/tables/tables'
import type {
	CategoryItemDto,
	FoodItemDto,
	GetFoodsResponseDto,
	TableDto,
} from '@/api/model'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { STALE_TIME_STATIC } from '@/common/constants'

export function useTableOrdering() {
	const { id = '' } = useParams()
	const { i18n } = useTranslation()

	const [search, setSearch] = useState('')
	const [category, setCategory] = useState('all')
	const [total, setTotal] = useState(0)
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const [configOpen, setConfigOpen] = useState(false)

	const debouncedSearch = useDebounce(search, 300)
	const pagination = usePagination({ total, initialCount: 12 })
	const { page, count, setPage } = pagination

	useEffect(() => {
		setPage(1)
	}, [debouncedSearch, category, setPage])

	const { data: table } = useGetTableById<TableDto>(id)

	const { data: categories = [] } = useGetCategories<CategoryItemDto[]>(
		{ lang: i18n.language },
		{ query: { staleTime: STALE_TIME_STATIC } }
	)

	const { data, isLoading, isError } = useGetFoods<GetFoodsResponseDto>(
		{
			lang: i18n.language,
			page,
			count,
			category: category === 'all' ? undefined : category,
		},
		{ query: { staleTime: STALE_TIME_STATIC } }
	)

	useEffect(() => {
		if (data?.total !== undefined) setTotal(data.total)
	}, [data?.total])

	const foods = useMemo(() => {
		const all = data?.foods ?? []
		const q = debouncedSearch.trim().toLowerCase()
		if (!q) return all
		return all.filter(
			(f: FoodItemDto) =>
				f.name.toLowerCase().includes(q) ||
				f.description?.toLowerCase().includes(q)
		)
	}, [data?.foods, debouncedSearch])

	const selectedFoods = useMemo(
		() => (data?.foods ?? []).filter(f => selected.has(f.id)),
		[data?.foods, selected]
	)

	const toggle = (foodId: string) =>
		setSelected(prev => {
			const next = new Set(prev)
			if (next.has(foodId)) next.delete(foodId)
			else next.add(foodId)
			return next
		})

	return {
		tableId: id,
		table,
		search,
		setSearch,
		category,
		setCategory,
		categories,
		foods,
		isLoading,
		isError,
		pagination,
		selected,
		toggle,
		clear: () => setSelected(new Set()),
		selectedFoods,
		configOpen,
		setConfigOpen,
		openConfig: () => selected.size > 0 && setConfigOpen(true),
		handleDone: () => {
			setConfigOpen(false)
			setSelected(new Set())
		},
	}
}
