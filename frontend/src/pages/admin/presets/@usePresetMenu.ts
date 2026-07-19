import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import {
	useGetPresetMenus,
	useCreatePresetMenu,
	useUpdatePresetMenu,
	useDeletePresetMenu,
	useAddPresetMenuItem,
	useUpdatePresetMenuItem,
	useRemovePresetMenuItem,
	getGetPresetMenusQueryKey,
} from '@/api/preset-menus/preset-menus'
import type { PresetMenuDto, PresetMenuItemDto } from '@/api/model'
import { useToast } from '@/hooks/useToast'

export function usePresetMenu() {
	const { t } = useTranslation()
	const toast = useToast()
	const qc = useQueryClient()

	const [activeId, setActiveId] = React.useState<string | null>(null)

	const { data: presets = [], isLoading } = useGetPresetMenus<PresetMenuDto[]>()

	const selectedPreset =
		presets.find(p => p.id === activeId) ?? presets[0] ?? null

	const invalidate = () =>
		qc.invalidateQueries({ queryKey: getGetPresetMenusQueryKey() })

	const onError = () => toast.error(t('admin.presets.save_failed'))

	const { mutate: createMutate, isPending: creating } = useCreatePresetMenu({
		mutation: { onSuccess: invalidate, onError },
	})
	const { mutate: updateMutate } = useUpdatePresetMenu({
		mutation: { onSuccess: invalidate, onError },
	})
	const { mutate: deleteMutate } = useDeletePresetMenu({
		mutation: { onSuccess: invalidate, onError },
	})
	const { mutate: addItemMutate } = useAddPresetMenuItem({
		mutation: { onSuccess: invalidate, onError },
	})
	const { mutate: updateItemMutate } = useUpdatePresetMenuItem({
		mutation: { onSuccess: invalidate, onError },
	})
	const { mutate: removeItemMutate } = useRemovePresetMenuItem({
		mutation: { onSuccess: invalidate, onError },
	})

	const onItemsChange = React.useCallback(
		(presetId: string, updated: PresetMenuItemDto[]) => {
			const prev = presets.find(p => p.id === presetId)?.items ?? []
			for (const next of updated) {
				const old = prev.find(i => i.variantId === next.variantId)
				if (old && old.quantity !== next.quantity) {
					updateItemMutate({
						id: presetId,
						variantId: next.variantId,
						data: { quantity: next.quantity },
					})
				}
			}
		},
		[presets, updateItemMutate]
	)

	return {
		presets,
		isLoading,
		creating,
		selectedPreset,
		setActiveId,
		createPreset: (price: number) =>
			createMutate({ data: { price, isActive: false } }),
		updatePreset: (id: string, price?: number, isActive?: boolean) =>
			updateMutate({ id, data: { price, isActive } }),
		deletePreset: (id: string) => deleteMutate({ id }),
		addItem: (presetId: string, variantId: string) =>
			addItemMutate({ id: presetId, data: { variantId, quantity: 1 } }),
		removeItem: (presetId: string, variantId: string) =>
			removeItemMutate({ id: presetId, variantId }),
		onItemsChange,
	}
}
