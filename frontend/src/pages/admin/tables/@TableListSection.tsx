import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, Trash2, ArchiveRestore } from 'lucide-react'
import type { TableDto } from '@/api/model'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { cn } from '@/utils/shadcn'

interface TableListSectionProps {
	tables: TableDto[]
	isLoading: boolean
	showMoveToStaging?: boolean
	onBulkDelete: (ids: string[]) => void
	onMoveToStaging?: (ids: string[]) => void
}

export function TableListSection({
	tables,
	isLoading,
	showMoveToStaging,
	onBulkDelete,
	onMoveToStaging,
}: TableListSectionProps) {
	const { t } = useTranslation()
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const [confirmOpen, setConfirmOpen] = useState(false)

	const toggle = (id: string) => {
		setSelected(prev => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	const toggleAll = () => {
		setSelected(prev =>
			prev.size === tables.length ? new Set() : new Set(tables.map(t => t.id))
		)
	}

	if (isLoading) {
		return (
			<div className='flex justify-center py-10'>
				<Spinner />
			</div>
		)
	}

	if (tables.length === 0) {
		return (
			<p className='py-6 text-center text-sm text-muted-foreground'>
				{t('admin.tables.empty')}
			</p>
		)
	}

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center gap-2'>
				<Checkbox
					checked={selected.size > 0 && selected.size === tables.length}
					onCheckedChange={toggleAll}
				/>
				<span className='text-xs text-muted-foreground'>
					{selected.size > 0
						? t('admin.tables.selected_count', { count: selected.size })
						: t('admin.tables.select_all')}
				</span>
			</div>

			<ul className='grid gap-2 sm:grid-cols-2'>
				{tables.map(table => {
					const full = table.seated >= table.capacity
					return (
						<li
							key={table.id}
							className={cn(
								'flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-sm transition-colors',
								selected.has(table.id)
									? 'border-primary/60'
									: 'border-border/60'
							)}
						>
							<Checkbox
								checked={selected.has(table.id)}
								onCheckedChange={() => toggle(table.id)}
							/>
							<div className='flex flex-1 items-center justify-between gap-2'>
								<span className='font-medium text-foreground'>
									{table.name}
								</span>
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
								</span>
							</div>
						</li>
					)
				})}
			</ul>

			{selected.size > 0 && (
				<div className='fixed inset-x-0 bottom-4 z-30 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2.5 shadow-lg'>
					<span className='text-sm font-medium text-foreground'>
						{t('admin.tables.selected_count', { count: selected.size })}
					</span>
					{showMoveToStaging && onMoveToStaging && (
						<Button
							size='sm'
							variant='outline'
							className='gap-1.5 rounded-full'
							onClick={() => {
								onMoveToStaging([...selected])
								setSelected(new Set())
							}}
						>
							<ArchiveRestore className='size-3.5' />
							{t('admin.tables.move_to_staging')}
						</Button>
					)}
					<Button
						size='sm'
						variant='destructive'
						className='gap-1.5 rounded-full'
						onClick={() => setConfirmOpen(true)}
					>
						<Trash2 className='size-3.5' />
						{t('admin.tables.delete_selected')}
					</Button>
				</div>
			)}

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title={t('admin.tables.bulk_delete_title', { count: selected.size })}
				description={t('admin.tables.bulk_delete_desc')}
				confirmLabel={t('admin.tables.delete_selected')}
				onConfirm={() => {
					onBulkDelete([...selected])
					setSelected(new Set())
					setConfirmOpen(false)
				}}
			/>
		</div>
	)
}
