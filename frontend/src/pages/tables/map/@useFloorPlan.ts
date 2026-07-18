import { useGetTables } from '@/api/tables/tables'
import type { TableListDto } from '@/api/model'

export function useFloorPlan() {
	const { data, isLoading, isError } = useGetTables<TableListDto>({
		count: 100,
	})

	const positioned = (data?.tables ?? []).filter(
		t => t.x !== null && t.x !== undefined && t.y !== null && t.y !== undefined
	)

	return { tables: positioned, isLoading, isError }
}
