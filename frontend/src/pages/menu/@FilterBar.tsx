import { useTranslation } from 'react-i18next'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/utils/shadcn'
import type { CategoryItemDto } from '@/api/model'

interface FilterBarProps {
	search: string
	onSearchChange: (value: string) => void
	count: number
	onCountChange: (value: number) => void
	activeCategory: string
	onCategoryChange: (id: string) => void
	categories: CategoryItemDto[]
}

export function FilterBar({
	search,
	onSearchChange,
	count,
	onCountChange,
	activeCategory,
	onCategoryChange,
	categories,
}: FilterBarProps) {
	const { t } = useTranslation()

	return (
		<div className='sticky top-14 z-20 -mx-4 border-b border-border/40 bg-background/95 px-4 py-3 shadow-sm backdrop-blur-sm sm:py-4'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder={t('menu.search_placeholder')}
						value={search}
						onChange={e => onSearchChange(e.target.value)}
						className='pl-9 rounded-full bg-muted/50 border-transparent focus-visible:border-primary focus-visible:ring-primary/20'
					/>
				</div>

				<div className='flex shrink-0 items-center gap-2'>
					<SlidersHorizontal className='h-4 w-4 text-muted-foreground' />
					<Select
						value={count.toString()}
						onValueChange={val => onCountChange(Number(val))}
					>
						<SelectTrigger className='h-9 w-24 rounded-full border-transparent bg-muted/50 text-sm'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[10, 20, 50, 100].map(n => (
								<SelectItem key={n} value={n.toString()}>
									{n}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<ScrollArea className='mt-3 w-full' type='scroll'>
				<div className='flex gap-2 pb-1'>
					<CategoryPill
						label={t('menu.all_categories')}
						active={activeCategory === 'all'}
						onClick={() => onCategoryChange('all')}
					/>
					{categories.map(cat => (
						<CategoryPill
							key={cat.id}
							label={cat.name ?? cat.key}
							active={activeCategory === cat.id}
							onClick={() => onCategoryChange(cat.id)}
						/>
					))}
				</div>
				<ScrollBar orientation='horizontal' className='h-1.5' />
			</ScrollArea>
		</div>
	)
}

function CategoryPill({
	label,
	active,
	onClick,
}: {
	label: string
	active: boolean
	onClick: () => void
}) {
	return (
		<button
			onClick={onClick}
			className={cn(
				'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
				active
					? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
					: 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
			)}
		>
			{label}
		</button>
	)
}
