import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateOrderBatch } from '@/api/orders/orders'
import { getGetOrdersQueryKey } from '@/api/orders/orders'
import { useGuest } from '@/hooks/useGuest'
import { useToast } from '@/hooks/useToast'
import type { FoodItemDto } from '@/api/model'

export function useMenuSelection(foods: FoodItemDto[]) {
	const { t } = useTranslation()
	const toast = useToast()
	const qc = useQueryClient()
	const activeTableId = useGuest(s => s.activeTableId)
	const [selected, setSelected] = useState<Set<string>>(new Set())

	const toggle = (foodId: string) => {
		setSelected(prev => {
			const next = new Set(prev)
			if (next.has(foodId)) next.delete(foodId)
			else next.add(foodId)
			return next
		})
	}

	const clear = () => setSelected(new Set())

	const { mutate, isPending } = useCreateOrderBatch({
		mutation: {
			onSuccess: () => {
				if (activeTableId) {
					qc.invalidateQueries({
						queryKey: getGetOrdersQueryKey({ tableId: activeTableId }),
					})
				}
				toast.success(t('menu.added_to_order'))
				clear()
			},
			onError: () => toast.error(t('menu.add_failed')),
		},
	})

	const addSelected = () => {
		if (!activeTableId) return
		const items = foods
			.filter(f => selected.has(f.id) && f.defaultVariantId)
			.map(f => ({ variantId: f.defaultVariantId as string, quantity: 1 }))
		if (items.length === 0) return
		mutate({ data: { tableId: activeTableId, items, splitAll: true } })
	}

	return {
		selected,
		toggle,
		clear,
		addSelected,
		isPending,
		activeTableId,
		count: selected.size,
	}
}
