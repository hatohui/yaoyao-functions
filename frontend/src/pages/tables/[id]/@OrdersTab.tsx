import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Minus, Plus, Trash2, Users2 } from 'lucide-react'
import type { OrderResponseDto, PersonDto, TableDto } from '@/api/model'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { useOrders } from './@useOrders'
import { SplitPickerModal } from './@SplitPickerModal'
import { useWhoAmI } from '@/hooks/useWhoAmI'

interface OrdersTabProps {
	table: TableDto
	people: PersonDto[]
}

export function OrdersTab({ table, people }: OrdersTabProps) {
	const { t } = useTranslation()
	const { orders, isLoading, total, setQuantity, setSplit, remove } = useOrders(
		table.id
	)
	const { personId: myPersonId } = useWhoAmI(table.id)
	const [editing, setEditing] = useState<OrderResponseDto | null>(null)
	const [removing, setRemoving] = useState<OrderResponseDto | null>(null)

	const splitLabel = (order: OrderResponseDto) => {
		if (order.splitAll) return t('orders.shared')
		if (order.splits.length === 1) return t('orders.personal')
		return t('orders.split_n', { count: order.splits.length })
	}

	if (isLoading) {
		return (
			<p className='py-10 text-center text-sm text-muted-foreground'>
				{t('common.loading')}
			</p>
		)
	}

	return (
		<div className='flex flex-col gap-3'>
			{orders.length === 0 ? (
				<p className='py-6 text-center text-sm text-muted-foreground'>
					{t('orders.empty')}
				</p>
			) : (
				<ul className='flex flex-col gap-2'>
					{orders.map(order => (
						<li
							key={order.id}
							className='flex flex-col gap-2 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm'
						>
							<div className='flex items-start justify-between gap-2'>
								<div className='flex flex-col gap-1'>
									<span className='font-medium text-foreground'>
										{order.foodName}
										{order.variantLabel ? ` — ${order.variantLabel}` : ''}
									</span>
									<button
										type='button'
										onClick={() => setEditing(order)}
										className='w-fit'
									>
										<Badge variant='outline' className='gap-1 rounded-full'>
											<Users2 className='size-3' />
											{splitLabel(order)}
										</Badge>
									</button>
								</div>
								<button
									type='button'
									onClick={() => setRemoving(order)}
									aria-label={t('orders.remove')}
									className='rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
								>
									<Trash2 className='size-4' />
								</button>
							</div>

							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<button
										type='button'
										onClick={() => setQuantity(order.id, order.quantity - 1)}
										disabled={order.quantity <= 1}
										className='flex size-7 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:bg-muted disabled:opacity-40'
									>
										<Minus className='size-3.5' />
									</button>
									<span className='w-6 text-center text-sm font-medium text-foreground'>
										{order.quantity}
									</span>
									<button
										type='button'
										onClick={() => setQuantity(order.id, order.quantity + 1)}
										className='flex size-7 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:bg-muted'
									>
										<Plus className='size-3.5' />
									</button>
								</div>
								<span className='text-sm font-medium text-foreground'>
									{(order.price * order.quantity).toFixed(2)}
								</span>
							</div>
						</li>
					))}
				</ul>
			)}

			{orders.length > 0 && (
				<div className='flex items-center justify-between border-t border-border/60 pt-3 text-sm font-semibold text-foreground'>
					<span>{t('orders.total')}</span>
					<span>{total.toFixed(2)}</span>
				</div>
			)}

			<SplitPickerModal
				open={editing !== null}
				onOpenChange={open => !open && setEditing(null)}
				people={people}
				initialPersonIds={editing?.splits.map(s => s.personId) ?? []}
				initialSplitAll={editing?.splitAll ?? true}
				myPersonId={myPersonId}
				onConfirm={(splitAll, personIds) => {
					if (editing) setSplit(editing.id, splitAll, personIds)
					setEditing(null)
				}}
			/>

			<ConfirmDialog
				open={removing !== null}
				onOpenChange={open => !open && setRemoving(null)}
				title={t('orders.remove_title', { name: removing?.foodName })}
				description={t('orders.remove_desc')}
				confirmLabel={t('orders.remove')}
				onConfirm={() => {
					if (removing) remove(removing.id)
					setRemoving(null)
				}}
			/>
		</div>
	)
}
