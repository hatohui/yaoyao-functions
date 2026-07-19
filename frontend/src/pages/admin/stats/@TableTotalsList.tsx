import { useTranslation } from 'react-i18next'
import { TriangleAlert } from 'lucide-react'
import type { TableTotalDto } from '@/api/model'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/shadcn'

interface TableTotalsListProps {
	totals: TableTotalDto[]
	isLoading: boolean
}

export function TableTotalsList({ totals, isLoading }: TableTotalsListProps) {
	const { t } = useTranslation()

	if (isLoading) {
		return (
			<div className='flex justify-center py-10'>
				<Spinner />
			</div>
		)
	}

	if (totals.length === 0) {
		return (
			<p className='py-6 text-center text-sm text-muted-foreground'>
				{t('admin.stats.totals_empty')}
			</p>
		)
	}

	return (
		<ul className='grid gap-2 sm:grid-cols-2'>
			{totals.map(row => (
				<li
					key={row.tableId}
					className={cn(
						'flex items-center justify-between gap-2 rounded-2xl border bg-card px-4 py-3 shadow-sm',
						row.isOutlier ? 'border-destructive/50' : 'border-border/60'
					)}
				>
					<span className='font-medium text-foreground'>{row.name}</span>
					<div className='flex items-center gap-2'>
						<span className='text-sm font-medium text-foreground'>
							{row.total.toFixed(2)}
						</span>
						{row.isOutlier && (
							<Badge
								variant='outline'
								className='gap-1 rounded-full border-destructive/50 text-destructive'
							>
								<TriangleAlert className='size-3' />
								{t('admin.stats.outlier')}
							</Badge>
						)}
					</div>
				</li>
			))}
		</ul>
	)
}
