import { AboutHero } from './@AboutHero'
import { LocationSection } from './@LocationSection'
import { YaoYaoDetailsSection } from './@YaoYaoDetailsSection'
import { SocialSidebar } from './@SocialSidebar'

export default function AboutPage() {
	return (
		<div className='min-h-screen'>
			<section className='relative overflow-hidden border-b border-border/60 bg-brand-muted'>
				<div className='mx-auto max-w-5xl px-4 lg:grid lg:grid-cols-[1fr_2fr] lg:items-center lg:gap-8'>
					<AboutHero />
					<LocationSection />
				</div>
			</section>
			<div className='pt-12'>
				<YaoYaoDetailsSection />
				<SocialSidebar />
			</div>
		</div>
	)
}
