import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'
import type { TableDto } from '@/api/model'
import { cn } from '@/utils/shadcn'

interface FloorPlanCanvasProps {
	tables: TableDto[]
}

// x/y are treated as percentages (0-100) of the canvas, so the same layout
// scales to any container size - the future admin floor-plan editor must save
// positions on this same convention.
export function FloorPlanCanvas({ tables }: FloorPlanCanvasProps) {
	const { t } = useTranslation()
	const navigate = useNavigate()

	return (
		<div className='relative aspect-square w-full overflow-hidden rounded-2xl border border-border/60 bg-muted'>
			{tables.map(table => {
				const full = table.seated >= table.capacity
				return (
					<button
						key={table.id}
						type='button'
						onClick={() => navigate(`/tables/${table.id}`)}
						style={{ left: `${table.x}%`, top: `${table.y}%` }}
						className={cn(
							'absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-2xl border bg-card px-3 py-2 text-xs font-medium shadow-sm transition-transform hover:scale-105',
							full ? 'border-destructive/40' : 'border-primary/40'
						)}
					>
						<span className='text-foreground'>{table.name}</span>
						<span className='flex items-center gap-1 text-muted-foreground'>
							<Users className='size-3' />
							{table.seated}/{table.capacity}
						</span>
					</button>
				)
			})}

			{tables.length === 0 && (
				<p className='absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground'>
					{t('floor_plan.empty')}
				</p>
			)}
		</div>
	)
}
