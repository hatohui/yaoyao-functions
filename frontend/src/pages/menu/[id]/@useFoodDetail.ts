import { useState } from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useGetFoodById } from '@/api/foods/foods'
import { useCreateOrder } from '@/api/orders/orders'
import { getGetOrdersQueryKey } from '@/api/orders/orders'
import { useQueryClient } from '@tanstack/react-query'
import { useGuest } from '@/hooks/useGuest'
import { useToast } from '@/hooks/useToast'
import type { FoodDetailDto } from '@/api/model'

export function useFoodDetail() {
	const { id = '' } = useParams()
	const { t, i18n } = useTranslation()
	const toast = useToast()
	const qc = useQueryClient()
	const activeTableId = useGuest(s => s.activeTableId)

	const {
		data: food,
		isLoading,
		isError,
	} = useGetFoodById<FoodDetailDto>(id, {
		lang: i18n.language,
	})

	const availableVariants = (food?.variants ?? []).filter(v => v.isAvailable)
	const [variantId, setVariantId] = useState<string | null>(null)
	const selectedVariant =
		availableVariants.find(v => v.id === variantId) ??
		availableVariants[0] ??
		null

	const { mutate, isPending } = useCreateOrder({
		mutation: {
			onSuccess: () => {
				if (activeTableId) {
					qc.invalidateQueries({
						queryKey: getGetOrdersQueryKey({ tableId: activeTableId }),
					})
				}
				toast.success(t('menu.added_to_order'))
			},
			onError: () => toast.error(t('menu.add_failed')),
		},
	})

	const addToOrder = () => {
		if (!activeTableId || !selectedVariant) return
		mutate({
			data: {
				tableId: activeTableId,
				variantId: selectedVariant.id,
				splitAll: true,
			},
		})
	}

	return {
		id,
		food,
		isLoading,
		isError,
		availableVariants,
		selectedVariant,
		setVariantId,
		activeTableId,
		addToOrder,
		isPending,
	}
}
