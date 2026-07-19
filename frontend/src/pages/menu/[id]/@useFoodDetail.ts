import { useState } from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useGetFoodById } from '@/api/foods/foods'
import { STALE_TIME_STATIC } from '@/common/constants'
import type { FoodDetailDto } from '@/api/model'

export function useFoodDetail() {
	const { id = '' } = useParams()
	const { i18n } = useTranslation()
	const [pickerOpen, setPickerOpen] = useState(false)
	const [configOpen, setConfigOpen] = useState(false)
	const [tableId, setTableId] = useState<string | null>(null)

	const {
		data: food,
		isLoading,
		isError,
	} = useGetFoodById<FoodDetailDto>(
		id,
		{ lang: i18n.language },
		{ query: { staleTime: STALE_TIME_STATIC, refetchOnWindowFocus: false } }
	)

	const availableVariants = (food?.variants ?? []).filter(v => v.isAvailable)

	const openPicker = () => {
		if (availableVariants.length === 0) return
		setPickerOpen(true)
	}

	const selectTable = (id: string) => {
		setTableId(id)
		setPickerOpen(false)
		setConfigOpen(true)
	}

	const handleDone = () => setConfigOpen(false)

	return {
		id,
		food,
		isLoading,
		isError,
		availableVariants,
		pickerOpen,
		setPickerOpen,
		openPicker,
		configOpen,
		setConfigOpen,
		tableId,
		selectTable,
		handleDone,
	}
}
