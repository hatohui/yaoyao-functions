import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FoodItemDto } from '@/api/model'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/shadcn'
import { ASSET_URL } from '@/common/app'

interface FoodCardProps {
	food: FoodItemDto
	onClick?: () => void
}

export function FoodCard({ food, onClick }: FoodCardProps) {
	const { t } = useTranslation()
	const [imgError, setImgError] = useState(false)

	const imageSrc =
		food.imageUrl && !imgError
			? food.imageUrl.startsWith('http')
				? food.imageUrl
				: `${ASSET_URL}/${food.imageUrl}`
			: null

	return (
		<div
			className={cn(
				'group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm',
				'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
				!food.isAvailable && 'opacity-70',
				onClick && 'cursor-pointer'
			)}
			onClick={onClick}
		>
			<div className='relative aspect-[4/3] overflow-hidden bg-muted'>
				{imageSrc ? (
					<img
						src={imageSrc}
						alt={food.name}
						className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
						onError={() => setImgError(true)}
					/>
				) : (
					<div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-muted to-muted'>
						<span className='text-5xl'>🍽️</span>
					</div>
				)}

				<div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

				{!food.isAvailable && (
					<div className='absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]'>
						<Badge variant='destructive' className='px-3 py-1 text-sm font-semibold shadow-lg'>
							{t('menu.unavailable')}
						</Badge>
					</div>
				)}

				{(food as { isChecked?: boolean }).isChecked && (
					<div className='absolute right-2 top-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-xs font-medium text-primary-foreground shadow backdrop-blur-sm'>
						✓ {t('menu.verified')}
					</div>
				)}
			</div>

			<div className='flex flex-1 flex-col gap-1.5 p-4'>
				<h3 className='line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary'>
					{food.name}
				</h3>
				{food.description && (
					<p className='line-clamp-2 text-sm leading-relaxed text-muted-foreground'>
						{food.description}
					</p>
				)}
			</div>
		</div>
	)
}
