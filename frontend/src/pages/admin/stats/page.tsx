import { useTranslation } from 'react-i18next'
import { cn } from '@/utils/shadcn'
import { PopularItemsList } from './@PopularItemsList'
import { TableTotalsList } from './@TableTotalsList'
import { useAdminStats } from './@useAdminStats'

export default function AdminStatsPage() {
	const { t } = useTranslation()
	const {
		scope,
		setScope,
		popular,
		popularLoading,
		tableTotals,
		totalsLoading,
	} = useAdminStats()

	return (
		<div className='flex flex-col gap-6'>
			<h1 className='text-xl font-bold text-foreground'>
				{t('admin.stats.title')}
			</h1>

			<div className='flex flex-col gap-3'>
				<div className='flex items-center justify-between gap-2'>
					<p className='text-sm font-semibold text-foreground'>
						{t('admin.stats.popular_title')}
					</p>
					<div className='flex items-center gap-1 rounded-full border border-border/60 p-0.5'>
						{(['event', 'all'] as const).map(s => (
							<button
								key={s}
								type='button'
								onClick={() => setScope(s)}
								className={cn(
									'rounded-full px-3 py-1 text-xs font-medium transition-colors',
									scope === s
										? 'bg-primary text-primary-foreground'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{s === 'event'
									? t('admin.stats.scope_event')
									: t('admin.stats.scope_all')}
							</button>
						))}
					</div>
				</div>
				<PopularItemsList items={popular} isLoading={popularLoading} />
			</div>

			<div className='flex flex-col gap-3'>
				<p className='text-sm font-semibold text-foreground'>
					{t('admin.stats.totals_title')}
				</p>
				<TableTotalsList totals={tableTotals} isLoading={totalsLoading} />
			</div>
		</div>
	)
}
