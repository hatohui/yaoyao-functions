import { useTranslation } from 'react-i18next'
import { MapPin } from 'lucide-react'

interface HeroSectionProps {
	totalCount?: number
}

export function HeroSection({ totalCount }: HeroSectionProps) {
	const { t } = useTranslation()

	return (
		<section className='border-b border-border/60 py-10 text-center sm:py-12'>
			<div className='mx-auto max-w-6xl px-4'>
				<h1 className='text-3xl font-bold tracking-tight text-primary sm:text-4xl'>
					{t('menu.restaurant_name')}
				</h1>

				<p className='mt-1 text-base font-medium text-primary/70 sm:text-lg'>
					{t('menu.restaurant_en')}
				</p>

				<div className='mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground'>
					<MapPin className='size-3.5' />
					<span>{t('menu.restaurant_location')}</span>
				</div>

				{totalCount !== undefined && (
					<p className='mt-2 text-sm text-muted-foreground'>
						{t('menu.dishes_available', { count: totalCount })}
					</p>
				)}
			</div>
		</section>
	)
}
