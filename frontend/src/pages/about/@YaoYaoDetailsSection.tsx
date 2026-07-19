import { useTranslation } from 'react-i18next'
import { PartyPopper } from 'lucide-react'
import { ASSET_URL } from '@/common/app'

export function YaoYaoDetailsSection() {
	const { t } = useTranslation()

	return (
		<section className='mx-auto max-w-2xl px-4 pb-14 sm:pb-16'>
			<div className='rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8'>
				<img 
					src={`${ASSET_URL}/yaoyao.jpg`} 
					className='mb-6 w-full max-h-72 object-cover rounded-2xl' 
					alt='YaoYao' 
				/>
				<span className='inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent'>
					<PartyPopper className='size-3.5' />
					{t('about.details_tag')}
				</span>

				<h2 className='mt-3 text-xl font-bold text-foreground'>
					{t('about.details_title')}
				</h2>

				<div className='mt-3 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground'>
					<p>{t('about.details_body_1')}</p>
					<p>{t('about.details_body_2')}</p>
				</div>
			</div>
		</section>
	)
}
