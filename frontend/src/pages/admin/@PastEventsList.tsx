import { useTranslation } from 'react-i18next'
import { CalendarClock } from 'lucide-react'
import type { EventSummaryDto } from '@/api/model'

interface PastEventsListProps {
	events: EventSummaryDto[]
	isLoading: boolean
}

export function PastEventsList({ events, isLoading }: PastEventsListProps) {
	const { t, i18n } = useTranslation()

	if (isLoading) {
		return (
			<p className='py-6 text-center text-sm text-muted-foreground'>
				{t('common.loading')}
			</p>
		)
	}

	if (events.length === 0) {
		return (
			<p className='py-6 text-center text-sm text-muted-foreground'>
				{t('admin.dashboard.past_events_empty')}
			</p>
		)
	}

	return (
		<ul className='flex flex-col gap-2'>
			{events.map(event => (
				<li
					key={event.id}
					className='flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm'
				>
					<div className='flex items-center gap-3'>
						<div className='flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground'>
							<CalendarClock className='size-4' />
						</div>
						<div>
							<p className='font-medium text-foreground'>
								{event.name || t('admin.dashboard.unnamed_event')}
							</p>
							<p className='text-xs text-muted-foreground'>
								{new Date(event.createdAt).toLocaleDateString(i18n.language)}
							</p>
						</div>
					</div>
					<div className='flex gap-3 text-xs text-muted-foreground'>
						<span>
							{t('admin.dashboard.stat_tables')}: {event.stats.tables}
						</span>
						<span>
							{t('admin.dashboard.stat_orders')}: {event.stats.orders}
						</span>
					</div>
				</li>
			))}
		</ul>
	)
}
