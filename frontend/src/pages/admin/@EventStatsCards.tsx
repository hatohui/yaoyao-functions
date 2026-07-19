import { useTranslation } from 'react-i18next'
import { Armchair, Users, ClipboardList, DoorOpen } from 'lucide-react'
import type { EventStatsDto } from '@/api/model'
import { Card } from '@/components/ui/card'

interface EventStatsCardsProps {
	stats: EventStatsDto
}

export function EventStatsCards({ stats }: EventStatsCardsProps) {
	const { t } = useTranslation()

	const items = [
		{
			key: 'tables',
			label: t('admin.dashboard.stat_tables'),
			value: stats.tables,
			icon: Armchair,
		},
		{
			key: 'occupied',
			label: t('admin.dashboard.stat_occupied'),
			value: stats.occupied,
			icon: DoorOpen,
		},
		{
			key: 'people',
			label: t('admin.dashboard.stat_people'),
			value: stats.people,
			icon: Users,
		},
		{
			key: 'orders',
			label: t('admin.dashboard.stat_orders'),
			value: stats.orders,
			icon: ClipboardList,
		},
	]

	return (
		<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
			{items.map(item => {
				const Icon = item.icon
				return (
					<Card key={item.key} className='gap-2 rounded-2xl px-4 py-4'>
						<div className='flex items-center gap-2 text-muted-foreground'>
							<Icon className='size-4' />
							<span className='text-xs font-medium uppercase tracking-wide'>
								{item.label}
							</span>
						</div>
						<span className='text-2xl font-bold text-foreground'>
							{item.value}
						</span>
					</Card>
				)
			})}
		</div>
	)
}
