import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import {
	useGetFoodsForAdmin,
	useCreateFood,
	useUpdateFood,
	useDeleteFood,
	useBulkToggleFoods,
	useBulkDeleteFoods,
	useAddFoodVariant,
	useUpdateFoodVariant,
	useDeleteFoodVariant,
	getGetFoodsForAdminQueryKey,
} from '@/api/foods/foods'
import { useGetCategories } from '@/api/categories/categories'
import type {
	CategoryItemDto,
	FoodDetailDto,
	GetFoodsForAdminResponseDto,
} from '@/api/model'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useToast } from '@/hooks/useToast'
import { updateFood as apiUpdateFood } from '@/api/foods/foods'

export function useFoodCatalog() {
	const { t, i18n } = useTranslation()
	const toast = useToast()
	const qc = useQueryClient()

	const [search, setSearch] = React.useState('')
	const [categoryId, setCategoryId] = React.useState('all')
	const [total, setTotal] = React.useState(0)
	const debouncedSearch = useDebounce(search, 300)
	const pagination = usePagination({ total, initialCount: 20 })

	const [failedTranslationFood, setFailedTranslationFood] = React.useState<{ id: string, name: string } | null>(null)

	const { data: categories = [] } = useGetCategories<CategoryItemDto[]>({
		lang: i18n.language,
	})

	const { data, isLoading } = useGetFoodsForAdmin<GetFoodsForAdminResponseDto>({
		lang: i18n.language,
		page: pagination.page,
		count: pagination.count,
		category: categoryId,
		search: debouncedSearch || undefined,
	})
	const foods = data?.foods ?? []

	React.useEffect(() => {
		if (data?.total !== undefined) setTotal(data.total)
	}, [data?.total])

	const invalidate = () =>
		qc.invalidateQueries({ queryKey: getGetFoodsForAdminQueryKey() })

	const onError = () => toast.error(t('admin.food.save_failed'))

	const { mutate: createFoodMutate, isPending: creating } = useCreateFood({
		mutation: { 
			onSuccess: (data) => {
				invalidate()
				if (data.aiTranslationFailed) {
					setFailedTranslationFood({ id: data.id, name: data.name })
				}
			}, 
			onError 
		},
	})
	const { mutate: updateFoodMutate } = useUpdateFood({
		mutation: { 
			onSuccess: (data) => {
				invalidate()
				if (data.aiTranslationFailed) {
					setFailedTranslationFood({ id: data.id, name: data.name })
				}
			}, 
			onError 
		},
	})
	const { mutate: deleteFoodMutate } = useDeleteFood({
		mutation: { onSuccess: invalidate, onError },
	})
	const { mutate: bulkToggleMutate } = useBulkToggleFoods({
		mutation: { onSuccess: invalidate, onError },
	})
	const { mutate: bulkDeleteMutate } = useBulkDeleteFoods({
		mutation: { onSuccess: invalidate, onError },
	})
	const { mutate: addVariantMutate } = useAddFoodVariant({
		mutation: { onSuccess: invalidate, onError },
	})
	const { mutate: updateVariantMutate } = useUpdateFoodVariant({
		mutation: { onSuccess: invalidate, onError },
	})
	const { mutate: removeVariantMutate } = useDeleteFoodVariant({
		mutation: { onSuccess: invalidate, onError },
	})

	const handleSaveTranslations = React.useCallback(
		async (translations: Record<string, string>) => {
			if (!failedTranslationFood) return
			const id = failedTranslationFood.id
			
			const promises = Object.entries(translations).map(([lang, name]) => {
				if (!name.trim()) return Promise.resolve()
				return apiUpdateFood(id, { data: { name, lang } })
			})

			await Promise.all(promises)
			invalidate()
		},
		[failedTranslationFood, invalidate]
	)

	return {
		search,
		setSearch,
		categoryId,
		setCategoryId,
		categories,
		pagination,
		foods,
		isLoading,
		creating,
		failedTranslationFood,
		setFailedTranslationFood,
		handleSaveTranslations,
		createFood: (name: string, catId: string, price: number) =>
			createFoodMutate({
				data: {
					name,
					categoryId: catId,
					lang: i18n.language,
					variants: [{ label: t('admin.food.default_variant_label'), price }],
				},
			}),
		updateFood: (
			id: string,
			patch: Parameters<typeof updateFoodMutate>[0]['data']
		) => updateFoodMutate({ id, data: { ...patch, lang: i18n.language } }),
		deleteFood: (id: string) => deleteFoodMutate({ id }),
		bulkToggle: (ids: string[], isAvailable: boolean) =>
			bulkToggleMutate({ data: { ids, isAvailable } }),
		bulkDelete: (ids: string[]) => bulkDeleteMutate({ data: { ids } }),
		addVariant: (foodId: string, label: string, price: number) =>
			addVariantMutate({ id: foodId, data: { label, price, lang: i18n.language } }),
		updateVariant: (variantId: string, patch: { label?: string; price?: number; isAvailable?: boolean }) =>
			updateVariantMutate({
				variantId,
				data: { ...patch, lang: i18n.language },
			}),
		removeVariant: (variantId: string) => removeVariantMutate({ variantId }),
		onDataChange: (updated: FoodDetailDto[]) => {
			// Called by DataGrid when a cell is edited inline.
			// We diff against the current snapshot and call updateFood for changed rows.
			for (const next of updated) {
				const prev = foods.find(f => f.id === next.id)
				if (!prev) continue
				const patch: Record<string, unknown> = {}
				if (prev.name !== next.name) patch.name = next.name
				if (prev.categoryId !== next.categoryId) patch.categoryId = next.categoryId
				if (prev.isAvailable !== next.isAvailable) patch.isAvailable = next.isAvailable
				if (prev.shouldCalculate !== next.shouldCalculate)
					patch.shouldCalculate = next.shouldCalculate
				if (Object.keys(patch).length > 0)
					updateFoodMutate({ id: next.id, data: { ...patch, lang: i18n.language } })
			}
		},
	}
}
