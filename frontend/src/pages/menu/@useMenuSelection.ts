import { useState } from 'react'
import type { FoodItemDto } from '@/api/model'

export function useMenuSelection(foods: FoodItemDto[]) {
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const [pickerOpen, setPickerOpen] = useState(false)
	const [configOpen, setConfigOpen] = useState(false)
	const [tableId, setTableId] = useState<string | null>(null)

	const toggle = (foodId: string) => {
		setSelected(prev => {
			const next = new Set(prev)
			if (next.has(foodId)) next.delete(foodId)
			else next.add(foodId)
			return next
		})
	}

	const clear = () => setSelected(new Set())

	const openPicker = () => {
		if (selected.size === 0) return
		setPickerOpen(true)
	}

	const selectTable = (id: string) => {
		setTableId(id)
		setPickerOpen(false)
		setConfigOpen(true)
	}

	const handleDone = () => {
		setConfigOpen(false)
		clear()
	}

	return {
		selected,
		toggle,
		clear,
		count: selected.size,
		pickerOpen,
		setPickerOpen,
		openPicker,
		configOpen,
		setConfigOpen,
		tableId,
		selectTable,
		selectedFoods: foods.filter(f => selected.has(f.id)),
		handleDone,
	}
}
