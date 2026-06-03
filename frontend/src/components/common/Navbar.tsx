import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSelector } from './LanguageSelector'
import { cn } from '@/utils/shadcn'
import { FlaskConical } from 'lucide-react'

export function Navbar() {
	const { t } = useTranslation()
	const { pathname } = useLocation()

	return (
		<header className='fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 shadow-sm backdrop-blur-xl'>
			<div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4'>
				<Link
					to='/'
					className='shrink-0 text-base font-bold tracking-tight text-foreground transition-opacity hover:opacity-70'
				>
					<span className='hidden sm:inline'>YaoYao Dinner</span>
					<span className='inline sm:hidden text-primary font-black'>YY</span>
				</Link>

				<nav className='flex items-center gap-1'>
					<Link
						to='/menu'
						className={cn(
							'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
							pathname === '/menu'
								? 'bg-primary/90 text-primary-foreground shadow-sm'
								: 'text-muted-foreground hover:bg-accent hover:text-foreground'
						)}
					>
						{t('nav.menu')}
					</Link>

					{import.meta.env.DEV && (
						<Link
							to='/dev'
							className={cn(
								'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
								pathname === '/dev'
									? 'bg-primary/90 text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:bg-accent hover:text-foreground'
							)}
						>
							<FlaskConical className='size-3.5' />
							<span className='hidden sm:inline'>{t('nav.dev')}</span>
						</Link>
					)}
				</nav>

				<div className='flex items-center gap-1'>
					<LanguageSelector />
					<ThemeToggle />
				</div>
			</div>
		</header>
	)
}
