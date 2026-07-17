import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Users } from 'lucide-react'
import type { TableDto } from '@/api/model'
import { cn } from '@/utils/shadcn'

interface TableListProps {
	tables: TableDto[]
}

export function TableList({ tables }: TableListProps) {
	const { t } = useTranslation()

	return (
		<ul className='flex flex-col gap-2.5'>
			{tables.map(table => {
				const full = table.seated >= table.capacity
				return (
					<li key={table.id}>
						<Link
							to={`/tables/${table.id}`}
							className='flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md'
						>
							<span className='font-medium text-foreground'>{table.name}</span>
							<span
								className={cn(
									'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
									full
										? 'bg-muted text-muted-foreground'
										: 'bg-brand-muted text-primary'
								)}
							>
								<Users className='size-3.5' />
								{table.seated}/{table.capacity}
								{full && ` · ${t('tables.full')}`}
							</span>
						</Link>
					</li>
				)
			})}
		</ul>
	)
}
