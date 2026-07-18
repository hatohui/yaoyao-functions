import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getGetOrdersQueryOptions } from '@/api/orders/orders'
import type { OrderResponseDto, PersonDto, TableDto } from '@/api/model'
import { useWhoAmI } from '@/hooks/useWhoAmI'
import { cn } from '@/utils/shadcn'

interface YourSplitTabProps {
	table: TableDto
	people: PersonDto[]
}

export function YourSplitTab({ table, people }: YourSplitTabProps) {
	const { t, i18n } = useTranslation()
	const { personId, setPersonId } = useWhoAmI(table.id)
	const { data: orders = [] } = useQuery(
		getGetOrdersQueryOptions<OrderResponseDto[]>({
			tableId: table.id,
			lang: i18n.language,
		})
	)

	if (!personId) {
		return (
			<div className='flex flex-col gap-3'>
				<p className='text-sm text-muted-foreground'>
					{t('split.who_are_you')}
				</p>
				<div className='flex flex-wrap gap-2'>
					{people.map(person => (
						<button
							key={person.id}
							type='button'
							onClick={() => setPersonId(person.id)}
							className='rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted'
						>
							{person.name}
						</button>
					))}
				</div>
			</div>
		)
	}

	const mine = orders.filter(
		(o: OrderResponseDto) =>
			o.splitAll || o.splits.some(s => s.personId === personId)
	)

	const lineShare = (order: OrderResponseDto) => {
		const lineTotal = order.price * order.quantity
		if (order.splitAll) return lineTotal / Math.max(people.length, 1)
		const n = order.splits.length || 1
		return lineTotal / n
	}

	const myTotal = mine.reduce((sum, o) => sum + lineShare(o), 0)
	const me = people.find(p => p.id === personId)

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center justify-between'>
				<p className='text-sm text-muted-foreground'>
					{t('split.viewing_as', { name: me?.name ?? '' })}
				</p>
				<button
					type='button'
					onClick={() => setPersonId('')}
					className='text-xs font-medium text-primary hover:underline'
				>
					{t('split.not_you')}
				</button>
			</div>

			{mine.length === 0 ? (
				<p className='py-6 text-center text-sm text-muted-foreground'>
					{t('split.empty')}
				</p>
			) : (
				<ul className='flex flex-col gap-2'>
					{mine.map(order => (
						<li
							key={order.id}
							className={cn(
								'flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm'
							)}
						>
							<span className='font-medium text-foreground'>
								{order.foodName}
								{order.variantLabel ? ` — ${order.variantLabel}` : ''}
							</span>
							<span className='text-sm font-medium text-foreground'>
								{lineShare(order).toFixed(2)}
							</span>
						</li>
					))}
				</ul>
			)}

			<div className='flex items-center justify-between border-t border-border/60 pt-3 text-sm font-semibold text-foreground'>
				<span>{t('split.your_total')}</span>
				<span>{myTotal.toFixed(2)}</span>
			</div>
		</div>
	)
}
