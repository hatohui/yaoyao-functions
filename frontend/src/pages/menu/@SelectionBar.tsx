import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ShoppingBag, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SelectionBarProps {
	count: number
	activeTableId: string | null
	pending?: boolean
	onClear: () => void
	onAdd: () => void
}

export function SelectionBar({
	count,
	activeTableId,
	pending,
	onClear,
	onAdd,
}: SelectionBarProps) {
	const { t } = useTranslation()

	if (count === 0) return null

	return (
		<div className='fixed inset-x-0 bottom-4 z-30 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-3 rounded-full border border-border/60 bg-card px-4 py-2.5 shadow-lg'>
			<button
				type='button'
				onClick={onClear}
				aria-label={t('menu.clear_selection')}
				className='rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground'
			>
				<X className='size-4' />
			</button>

			<span className='text-sm font-medium text-foreground'>
				{t('menu.selected_count', { count })}
			</span>

			{activeTableId ? (
				<Button
					size='sm'
					className='gap-1.5 rounded-full'
					disabled={pending}
					onClick={onAdd}
				>
					<ShoppingBag className='size-4' />
					{pending ? t('menu.adding') : t('menu.add_to_order')}
				</Button>
			) : (
				<Button size='sm' className='rounded-full' asChild>
					<Link to='/tables'>{t('menu.open_your_table')}</Link>
				</Button>
			)}
		</div>
	)
}
