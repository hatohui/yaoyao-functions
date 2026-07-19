import { AboutHero } from './@AboutHero'
import { LocationSection } from './@LocationSection'
import { YaoYaoDetailsSection } from './@YaoYaoDetailsSection'

export default function AboutPage() {
	return (
		<div className='min-h-screen bg-background'>
			<AboutHero />
			<LocationSection />
			<YaoYaoDetailsSection />
		</div>
	)
}
