import { useTranslation } from 'react-i18next'
import type { PopularItemDto } from '@/api/model'
import { Spinner } from '@/components/ui/spinner'

interface PopularItemsListProps {
	items: PopularItemDto[]
	isLoading: boolean
}

export function PopularItemsList({ items, isLoading }: PopularItemsListProps) {
	const { t } = useTranslation()

	if (isLoading) {
		return (
			<div className='flex justify-center py-10'>
				<Spinner />
			</div>
		)
	}

	if (items.length === 0) {
		return (
			<p className='py-6 text-center text-sm text-muted-foreground'>
				{t('admin.stats.popular_empty')}
			</p>
		)
	}

	const max = Math.max(...items.map(i => i.count), 1)

	return (
		<ul className='flex flex-col gap-2.5'>
			{items.map(item => (
				<li key={item.variantId} className='flex flex-col gap-1'>
					<div className='flex items-center justify-between text-sm'>
						<span className='font-medium text-foreground'>{item.name}</span>
						<span className='text-muted-foreground'>{item.count}</span>
					</div>
					<div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
						<div
							className='h-full rounded-full bg-primary'
							style={{ width: `${(item.count / max) * 100}%` }}
						/>
					</div>
				</li>
			))}
		</ul>
	)
}
