import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
	useGetTables,
	useUpdateTablePosition,
	getGetTablesQueryKey,
} from '@/api/tables/tables'
import type { TableDto, TableListDto } from '@/api/model'

export function useAdminFloorPlan() {
	const qc = useQueryClient()
	const { data, isLoading, isError } = useGetTables<TableListDto>({
		count: 100,
	})
	const [dragPositions, setDragPositions] = useState<
		Record<string, { x: number; y: number }>
	>({})

	const tables = useMemo<TableDto[]>(() => {
		const raw = data?.tables ?? []
		return raw.map((t, i) => {
			const drag = dragPositions[t.id]
			if (drag) return { ...t, x: drag.x, y: drag.y }
			if (
				t.x !== null &&
				t.x !== undefined &&
				t.y !== null &&
				t.y !== undefined
			) {
				return t
			}
			const col = i % 6
			const row = Math.floor(i / 6)
			return { ...t, x: 10 + col * 16, y: 10 + row * 16 }
		})
	}, [data?.tables, dragPositions])

	const { mutate } = useUpdateTablePosition({
		mutation: {
			onSuccess: () => {
				qc.invalidateQueries({ queryKey: getGetTablesQueryKey({ count: 100 }) })
			},
		},
	})

	const setPosition = (id: string, x: number, y: number) => {
		setDragPositions(prev => ({ ...prev, [id]: { x, y } }))
	}

	const commitPosition = (id: string, x: number, y: number) => {
		mutate({ id, data: { x, y } })
	}

	return { tables, isLoading, isError, setPosition, commitPosition }
}
