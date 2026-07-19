import { useTranslation } from 'react-i18next'
import { MapPin, PawPrint, Sparkles } from 'lucide-react'

export function AboutHero() {
	const { t } = useTranslation()

	return (
		<div className='relative py-12 text-center lg:text-left sm:py-16'>
			<PawPrint className='absolute -left-4 top-6 size-20 -rotate-12 text-primary/10 sm:size-28 lg:-left-12 lg:top-0 lg:size-20' />

			<div className='relative mx-auto max-w-xl  px-4 lg:mx-0 lg:px-0'>
				<span className='inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'>
					<Sparkles className='size-3.5' />
					{t('about.hero_tag')}
				</span>

				<h1 className='mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl'>
					{t('menu.restaurant_name')}
				</h1>

				<p className='mt-1 text-base font-medium text-primary/70 sm:text-lg'>
					{t('menu.restaurant_en')}
				</p>

				<div className='mt-3 flex items-center justify-center lg:justify-start gap-1.5 text-sm text-muted-foreground'>
					<MapPin className='size-3.5' />
					<span>{t('menu.restaurant_location')}</span>
				</div>
			</div>
		</div>
	)
}
