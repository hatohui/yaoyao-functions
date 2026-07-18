import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import type { FoodDetailDto, FoodVariantDto } from '@/api/model'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/shadcn'
import { ASSET_URL } from '@/common/app'

interface FoodDetailViewProps {
	food: FoodDetailDto
	availableVariants: FoodVariantDto[]
	selectedVariant: FoodVariantDto | null
	onSelectVariant: (id: string) => void
	activeTableId: string | null
	onAdd: () => void
	isPending: boolean
}

export function FoodDetailView({
	food,
	availableVariants,
	selectedVariant,
	onSelectVariant,
	activeTableId,
	onAdd,
	isPending,
}: FoodDetailViewProps) {
	const { t } = useTranslation()
	const [imgError, setImgError] = useState(false)

	const imageSrc =
		food.imageUrl && !imgError
			? food.imageUrl.startsWith('http')
				? food.imageUrl
				: `${ASSET_URL}/${food.imageUrl}`
			: null

	return (
		<div className='mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6'>
			<Link
				to='/menu'
				className='inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
			>
				<ArrowLeft className='size-4' />
				{t('food_detail.back_to_menu')}
			</Link>

			<div className='overflow-hidden rounded-2xl bg-muted'>
				{imageSrc ? (
					<img
						src={imageSrc}
						alt={food.name}
						className='aspect-[4/3] w-full object-cover'
						onError={() => setImgError(true)}
					/>
				) : (
					<div className='flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-brand-muted to-muted'>
						<span className='text-6xl'>🍽️</span>
					</div>
				)}
			</div>

			<div className='space-y-1.5'>
				<h1 className='text-2xl font-bold text-foreground'>{food.name}</h1>
				{food.description && (
					<p className='text-sm leading-relaxed text-muted-foreground'>
						{food.description}
					</p>
				)}
				{!food.isAvailable && (
					<p className='text-sm font-medium text-destructive'>
						{t('menu.unavailable')}
					</p>
				)}
			</div>

			{availableVariants.length > 0 && (
				<div className='flex flex-col gap-2'>
					<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
						{t('food_detail.variants')}
					</p>
					<div className='flex flex-wrap gap-2'>
						{availableVariants.map(v => (
							<button
								key={v.id}
								type='button'
								onClick={() => onSelectVariant(v.id)}
								className={cn(
									'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
									selectedVariant?.id === v.id
										? 'border-primary bg-primary text-primary-foreground'
										: 'border-border/60 bg-card text-foreground hover:bg-muted'
								)}
							>
								{v.label ? `${v.label} — ` : ''}
								{v.price} {v.currency}
							</button>
						))}
					</div>
				</div>
			)}

			{activeTableId ? (
				<Button
					size='lg'
					className='rounded-full'
					disabled={!selectedVariant || isPending}
					onClick={onAdd}
				>
					{isPending ? t('menu.adding') : t('food_detail.add_to_order')}
				</Button>
			) : (
				<Button size='lg' className='rounded-full' asChild>
					<Link to='/tables'>{t('menu.open_your_table')}</Link>
				</Button>
			)}
		</div>
	)
}
