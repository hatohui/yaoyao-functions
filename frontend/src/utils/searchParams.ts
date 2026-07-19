import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

export type MenuSort = 'name' | 'price' | 'popular'

export interface MenuSearchParams {
	page?: number
	count?: number
	category?: string
	sort?: MenuSort
	popular?: boolean
	lang?: string
}

const isMenuSort = (value: string | null): value is MenuSort =>
	value === 'name' || value === 'price' || value === 'popular'

export function useMenuSearchParams() {
	const [searchParams, setSearchParams] = useSearchParams()

	const page = Number(searchParams.get('page')) || 1
	const count = Number(searchParams.get('count')) || 16
	const category = searchParams.get('category') || 'all'
	const sort = isMenuSort(searchParams.get('sort'))
		? (searchParams.get('sort') as MenuSort)
		: 'name'
	const popular = searchParams.get('popular') === 'true'
	const lang = searchParams.get('lang') || undefined

	const updateParams = useCallback(
		(updates: Partial<MenuSearchParams>) => {
			setSearchParams(params => {
				Object.entries(updates).forEach(([key, value]) => {
					if (value === undefined || value === null || value === false) {
						params.delete(key)
					} else {
						params.set(key, String(value))
					}
				})
				return params
			})
		},
		[setSearchParams]
	)

	const setPage = useCallback(
		(newPage: number) => {
			updateParams({ page: newPage })
		},
		[updateParams]
	)

	const setCount = useCallback(
		(newCount: number) => {
			updateParams({ count: newCount, page: 1 })
		},
		[updateParams]
	)

	const setCategory = useCallback(
		(newCategory: string) => {
			updateParams({ category: newCategory, page: 1 })
		},
		[updateParams]
	)

	const setSort = useCallback(
		(newSort: MenuSort) => {
			updateParams({ sort: newSort, page: 1 })
		},
		[updateParams]
	)

	const setPopular = useCallback(
		(newPopular: boolean) => {
			updateParams({ popular: newPopular, page: 1 })
		},
		[updateParams]
	)

	const setLang = useCallback(
		(newLang: string | undefined) => {
			updateParams({ lang: newLang })
		},
		[updateParams]
	)

	const resetParams = useCallback(() => {
		setSearchParams({})
	}, [setSearchParams])

	return {
		page,
		count,
		category,
		sort,
		popular,
		lang,
		setPage,
		setCount,
		setCategory,
		setSort,
		setPopular,
		setLang,
		updateParams,
		resetParams,
	}
}

export function buildSearchParams(params: MenuSearchParams): URLSearchParams {
	const searchParams = new URLSearchParams()

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			searchParams.set(key, String(value))
		}
	})

	return searchParams
}

export function parseMenuSearchParams(
	searchParams: URLSearchParams
): MenuSearchParams {
	return {
		page: Number(searchParams.get('page')) || 1,
		count: Number(searchParams.get('count')) || 20,
		category: searchParams.get('category') || 'all',
		sort: isMenuSort(searchParams.get('sort'))
			? (searchParams.get('sort') as MenuSort)
			: 'name',
		popular: searchParams.get('popular') === 'true',
		lang: searchParams.get('lang') || undefined,
	}
}
