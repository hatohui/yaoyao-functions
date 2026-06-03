import { useTranslation } from 'react-i18next'
import { UtensilsCrossed, MapPin } from 'lucide-react'

interface HeroSectionProps {
	totalCount?: number
}

export function HeroSection({ totalCount }: HeroSectionProps) {
	const { t } = useTranslation()

	return (
		<section className='relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/20 via-primary/8 to-transparent py-12 text-center sm:py-16'>
			<div className='mx-auto max-w-6xl px-4'>
				<div className='mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary'>
					<UtensilsCrossed className='size-3.5' />
					<span>{t('menu.our_menu')}</span>
				</div>

				<h1 className='text-5xl font-black tracking-tight text-primary sm:text-6xl lg:text-7xl'>
					{t('menu.restaurant_name')}
				</h1>

				<p className='mt-1 text-xl font-semibold tracking-wide text-primary/70 sm:text-2xl'>
					{t('menu.restaurant_en')}
				</p>

				<div className='mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground'>
					<MapPin className='size-3.5' />
					<span>{t('menu.restaurant_location')}</span>
				</div>

				<p className='mt-4 text-sm text-muted-foreground sm:text-base'>
					{t('menu.tagline')}
				</p>

				{totalCount !== undefined && (
					<p className='mt-3 text-sm font-medium text-primary/80'>
						{t('menu.dishes_available', { count: totalCount })}
					</p>
				)}
			</div>
		</section>
	)
}
