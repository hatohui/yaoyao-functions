import { useTranslation } from 'react-i18next'
import { ArrowUpDown, Flame, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils/shadcn'
import { MENU_PAGE_SIZE_ALL, MENU_PAGE_SIZE_OPTIONS } from '@/common/constants'
import type { CategoryItemDto } from '@/api/model'
import type { MenuSort } from '@/utils/searchParams'

interface FilterBarProps {
	search: string
	onSearchChange: (value: string) => void
	count: number
	onCountChange: (value: number) => void
	activeCategory: string
	onCategoryChange: (id: string) => void
	categories: CategoryItemDto[]
	sort: MenuSort
	onSortChange: (value: MenuSort) => void
	popular: boolean
	onPopularChange: (value: boolean) => void
}

export function FilterBar({
	search,
	onSearchChange,
	count,
	onCountChange,
	activeCategory,
	onCategoryChange,
	categories,
	sort,
	onSortChange,
	popular,
	onPopularChange,
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
					<ArrowUpDown className='h-4 w-4 text-muted-foreground' />
					<Select
						value={sort}
						onValueChange={val => onSortChange(val as MenuSort)}
					>
						<SelectTrigger className='h-9 w-40 rounded-full border-transparent bg-muted/50 text-sm'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='name'>{t('menu.sort_name')}</SelectItem>
							<SelectItem value='price'>{t('menu.sort_price')}</SelectItem>
							<SelectItem value='price_desc'>{t('menu.sort_price_desc')}</SelectItem>
							<SelectItem value='popular'>{t('menu.sort_popular')}</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={count.toString()}
						onValueChange={val => onCountChange(Number(val))}
					>
						<SelectTrigger className='h-9 w-20 rounded-full border-transparent bg-muted/50 text-sm'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MENU_PAGE_SIZE_OPTIONS.map(n => (
								<SelectItem key={n} value={n.toString()}>
									{n}
								</SelectItem>
							))}
							<SelectItem value={MENU_PAGE_SIZE_ALL.toString()}>
								{t('menu.count_all')}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className='mt-3 flex flex-wrap gap-2 pt-1'>
				<CategoryPill
					label={t('menu.popular')}
					icon={Flame}
					active={popular}
					onClick={() => onPopularChange(!popular)}
				/>
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
		</div>
	)
}

function CategoryPill({
	label,
	icon: Icon,
	active,
	onClick,
}: {
	label: string
	icon?: typeof Flame
	active: boolean
	onClick: () => void
}) {
	return (
		<button
			onClick={onClick}
			className={cn(
				'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
				active
					? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
					: 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
			)}
		>
			{Icon && <Icon className='size-3.5' />}
			{label}
		</button>
	)
}
