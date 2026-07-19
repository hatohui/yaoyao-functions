import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import { getGetOrdersQueryOptions } from '@/api/orders/orders'
import type { OrderResponseDto, PersonDto, TableDto } from '@/api/model'
import { Badge } from '@/components/ui/badge'
import { useWhoAmI } from '@/hooks/useWhoAmI'
import { cn } from '@/utils/shadcn'

interface SplitsTabProps {
	table: TableDto
	people: PersonDto[]
}

export function SplitsTab({ table, people }: SplitsTabProps) {
	const { t, i18n } = useTranslation()
	const { personId: myPersonId } = useWhoAmI(table.id)
	const [expanded, setExpanded] = useState<Set<string>>(new Set())
	const { data: orders = [] } = useQuery(
		getGetOrdersQueryOptions<OrderResponseDto[]>({
			tableId: table.id,
			lang: i18n.language,
		})
	)

	const lineShare = (order: OrderResponseDto) => {
		const lineTotal = order.price * order.quantity
		if (order.splitAll) return lineTotal / Math.max(people.length, 1)
		const n = order.splits.length || 1
		return lineTotal / n
	}

	const toggle = (personId: string) => {
		setExpanded(prev => {
			const next = new Set(prev)
			if (next.has(personId)) next.delete(personId)
			else next.add(personId)
			return next
		})
	}

	const breakdown = people.map(person => {
		const items = orders.filter(
			(o: OrderResponseDto) =>
				o.splitAll || o.splits.some(s => s.personId === person.id)
		)
		const total = items.reduce(
			(sum, o) => (o.shouldCalculate ? sum + lineShare(o) : sum),
			0
		)
		return { person, items, total }
	})

	if (orders.length === 0) {
		return (
			<p className='py-6 text-center text-sm text-muted-foreground'>
				{t('split.empty')}
			</p>
		)
	}

	return (
		<ul className='flex flex-col gap-2'>
			{breakdown.map(({ person, items, total }) => {
				const isOpen = expanded.has(person.id)
				return (
					<li
						key={person.id}
						className='rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm'
					>
						<button
							type='button'
							onClick={() => toggle(person.id)}
							className='flex w-full items-center justify-between gap-2'
						>
							<span className='font-medium text-foreground'>
								{person.name}
								{person.id === myPersonId && (
									<span className='ml-1.5 text-xs font-normal text-muted-foreground'>
										{t('split.you')}
									</span>
								)}
							</span>
							<span className='flex items-center gap-1.5'>
								<span className='text-sm font-medium text-foreground'>
									{total.toFixed(2)}
								</span>
								<ChevronDown
									className={cn(
										'size-4 text-muted-foreground transition-transform',
										isOpen && 'rotate-180'
									)}
								/>
							</span>
						</button>

						{isOpen && (
							<ul className='mt-2.5 flex flex-col gap-1.5 border-t border-border/60 pt-2.5'>
								{items.map(o => (
									<li
										key={o.id}
										className='flex items-center justify-between gap-2 text-sm'
									>
										<span
											className={cn(
												'flex items-center gap-1.5',
												o.shouldCalculate
													? 'text-muted-foreground'
													: 'text-muted-foreground/50 italic'
											)}
										>
											{o.quantity > 1 && ` x${o.quantity} `}
											{o.foodName}
											{o.variantLabel ? ` - ${o.variantLabel}` : ''}
											{!o.shouldCalculate && (
												<Badge className='rounded-full border-accent/30 bg-accent/15 px-1.5 py-0 text-[10px] text-accent'>
													{t('split.free_badge')}
												</Badge>
											)}
										</span>
										<span
											className={cn(
												o.shouldCalculate
													? 'text-muted-foreground'
													: 'text-muted-foreground/50'
											)}
										>
											{o.shouldCalculate ? lineShare(o).toFixed(2) : '0.00'}
										</span>
									</li>
								))}
							</ul>
						)}
					</li>
				)
			})}
		</ul>
	)
}
