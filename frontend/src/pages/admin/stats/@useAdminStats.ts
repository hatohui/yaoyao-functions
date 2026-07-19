import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetPopularItems, useGetTableTotals } from '@/api/stats/stats'
import type { PopularItemDto, TableTotalDto } from '@/api/model'

export function useAdminStats() {
	const { i18n } = useTranslation()
	const [scope, setScope] = useState<'event' | 'all'>('event')

	const { data: popular = [], isLoading: popularLoading } = useGetPopularItems<
		PopularItemDto[]
	>({ scope, lang: i18n.language })

	const { data: tableTotals = [], isLoading: totalsLoading } =
		useGetTableTotals<TableTotalDto[]>()

	return {
		scope,
		setScope,
		popular,
		popularLoading,
		tableTotals,
		totalsLoading,
	}
}
