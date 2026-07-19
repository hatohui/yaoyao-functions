import { useTranslation } from 'react-i18next'
import { PartyPopper } from 'lucide-react'

export function YaoYaoDetailsSection() {
	const { t } = useTranslation()

	return (
		<section className='mx-auto max-w-2xl px-4 pb-14 sm:pb-16'>
			<div className='rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8'>
				<div className='mb-6 grid grid-cols-2 gap-4'>
					<img
						src={`/images/aster.jpg`}
						className='w-full h-48 sm:h-72 object-cover rounded-2xl shadow-sm'
						alt='Aster'
					/>
					<img
						src={`/images/yaoyao.jpg`}
						className='w-full h-48 sm:h-72 object-cover rounded-2xl shadow-sm'
						alt='YaoYao'
					/>
				</div>
				<span className='inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'>
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
