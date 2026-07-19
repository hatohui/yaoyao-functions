import { useTranslation } from 'react-i18next'
import { MapPin, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LocationSection() {
	const { t } = useTranslation()
	const address = '43, Jalan SS15/4E, Subang Jaya, Subang Jaya, Malaysia'
	const encodedAddress = encodeURIComponent(address)

	return (
		<div className='py-8 lg:py-12'>
			<div className='flex items-center gap-2'>
				<MapPin className='size-5 text-primary' />
				<h2 className='text-xl font-bold text-foreground'>
					{t('about.location_title')}
				</h2>
			</div>

			<div className='mt-4 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm'>
				<iframe
					title={t('about.location_title')}
					src={`https://www.google.com/maps?q=${encodedAddress}&output=embed`}
					className='h-64 w-full lg:h-72'
					loading='lazy'
					referrerPolicy='no-referrer-when-downgrade'
				/>

				<div className='flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5'>
					<div>
						<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
							{t('about.address_label')}
						</p>
						<p className='mt-0.5 text-sm text-foreground'>{address}</p>
					</div>

					<Button asChild size='sm' className='rounded-full gap-1.5'>
						<a
							href='https://maps.app.goo.gl/FqCuu25uEUchCgZd7'
							target='_blank'
							rel='noopener noreferrer'
						>
							<Navigation className='size-3.5' />
							{t('about.get_directions')}
						</a>
					</Button>
				</div>
			</div>
		</div>
	)
}
