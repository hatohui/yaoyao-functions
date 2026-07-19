import { AboutHero } from './@AboutHero'
import { LocationSection } from './@LocationSection'
import { YaoYaoDetailsSection } from './@YaoYaoDetailsSection'
import { SocialSidebar } from './@SocialSidebar'

export default function AboutPage() {
	return (
		<div className='min-h-screen'>
			<section className='relative overflow-hidden border-b border-border/60 bg-brand-muted'>
				<div className='mx-auto max-w-6xl px-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12'>
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
