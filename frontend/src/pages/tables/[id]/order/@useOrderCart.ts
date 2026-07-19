import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateOrderBatch, getGetOrdersQueryKey } from '@/api/orders/orders'
import { useGetTablePeople } from '@/api/tables/tables'
import type { FoodItemDto, PersonDto } from '@/api/model'
import type { SplitMode } from '@/components/common/SplitModeSelector'
import { useWhoAmI } from '@/hooks/useWhoAmI'
import { useToast } from '@/hooks/useToast'

export interface CartLine {
	foodId: string
	variantId: string
	name: string
	imageUrl: string | null
	price: number
	currency: string
	shouldCalculate: boolean
	quantity: number
	mode: SplitMode
	chosen: Set<string>
}

export function useOrderCart(tableId: string) {
	const { t } = useTranslation()
	const toast = useToast()
	const qc = useQueryClient()

	const { personId: myPersonId } = useWhoAmI(tableId)
	const { data: people = [] } = useGetTablePeople<PersonDto[]>(tableId)

	const [lines, setLines] = useState<Map<string, CartLine>>(new Map())

	const mutate = (foodId: string, apply: (line: CartLine) => CartLine | null) =>
		setLines(prev => {
			const next = new Map(prev)
			const current = next.get(foodId)
			if (!current) return prev
			const updated = apply(current)
			if (updated) next.set(foodId, updated)
			else next.delete(foodId)
			return next
		})

	const add = (food: FoodItemDto) => {
		if (!food.defaultVariantId) return
		setLines(prev => {
			const next = new Map(prev)
			const existing = next.get(food.id)
			if (existing) {
				next.set(food.id, { ...existing, quantity: existing.quantity + 1 })
				return next
			}
			next.set(food.id, {
				foodId: food.id,
				variantId: food.defaultVariantId!,
				name: food.name,
				imageUrl: food.imageUrl,
				price: food.price ?? 0,
				currency: food.currency ?? '',
				shouldCalculate: food.shouldCalculate,
				quantity: 1,
				mode: 'table',
				chosen: new Set<string>(),
			})
			return next
		})
	}

	const addConfigured = (
		food: FoodItemDto,
		variantId: string,
		price: number,
		quantity: number,
		mode: SplitMode,
		chosen: Set<string>
	) => {
		setLines(prev => {
			const next = new Map(prev)
			next.set(food.id, {
				foodId: food.id,
				variantId,
				name: food.name,
				imageUrl: food.imageUrl,
				price,
				currency: food.currency ?? '',
				shouldCalculate: food.shouldCalculate,
				quantity,
				mode,
				chosen,
			})
			return next
		})
	}

	const setQuantity = (foodId: string, quantity: number) =>
		mutate(foodId, line => (quantity < 1 ? null : { ...line, quantity }))

	const setMode = (foodId: string, mode: SplitMode) =>
		mutate(foodId, line => ({ ...line, mode }))

	const togglePerson = (foodId: string, personId: string) =>
		mutate(foodId, line => {
			const chosen = new Set(line.chosen)
			if (chosen.has(personId)) chosen.delete(personId)
			else chosen.add(personId)
			return { ...line, chosen }
		})

	const setVariant = (foodId: string, variantId: string, price: number) =>
		mutate(foodId, line => ({ ...line, variantId, price }))

	const remove = (foodId: string) => mutate(foodId, () => null)
	const clear = () => setLines(new Map())

	const items = useMemo(() => [...lines.values()], [lines])

	const itemCount = items.reduce((sum, l) => sum + l.quantity, 0)
	const total = items.reduce(
		(sum, l) => (l.shouldCalculate ? sum + l.price * l.quantity : sum),
		0
	)
	const currency = items.find(l => l.currency)?.currency ?? ''

	const { mutateAsync: createBatch, isPending } = useCreateOrderBatch()

	/** One batch call per distinct split config, since a batch shares its split. */
	const checkout = async () => {
		if (items.length === 0) return
		const groups = new Map<string, CartLine[]>()
		for (const line of items) {
			const key =
				line.mode === 'choose'
					? `choose:${[...line.chosen].sort().join(',')}`
					: line.mode
			groups.set(key, [...(groups.get(key) ?? []), line])
		}

		try {
			for (const group of groups.values()) {
				const [first] = group
				const personIds =
					first.mode === 'me'
						? myPersonId
							? [myPersonId]
							: []
						: first.mode === 'choose'
							? [...first.chosen]
							: []

				await createBatch({
					data: {
						tableId,
						items: group.map(l => ({
							variantId: l.variantId,
							quantity: l.quantity,
						})),
						splitAll: first.mode === 'table',
						personIds,
					},
				})
			}
			qc.invalidateQueries({ queryKey: getGetOrdersQueryKey() })
			clear()
			toast.success(t('orders.placed'))
			return true
		} catch {
			toast.error(t('orders.place_failed'))
			return false
		}
	}

	return {
		lines: items,
		quantityOf: (foodId: string) => lines.get(foodId)?.quantity ?? 0,
		add,
		addConfigured,
		setQuantity,
		setMode,
		setVariant,
		togglePerson,
		remove,
		clear,
		itemCount,
		total,
		currency,
		people,
		myPersonId,
		checkout,
		isPlacing: isPending,
	}
}
