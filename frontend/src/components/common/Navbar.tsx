import { useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSelector } from './LanguageSelector'
import { cn } from '@/utils/shadcn'
import { FlaskConical, ShieldCheck } from 'lucide-react'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { useConfig } from '@/hooks/useConfig'
import { ADMIN_GATE_TAPS, ADMIN_GATE_WINDOW_MS } from '@/common/constants'

export function Navbar() {
	const { t } = useTranslation()
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const { isAdmin } = useIsAdmin()
	const { feedbackWall } = useConfig()
	const tapCount = useRef(0)
	const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

	const handleLogoClick = (e: React.MouseEvent) => {
		tapCount.current += 1
		if (tapTimer.current) clearTimeout(tapTimer.current)

		if (tapCount.current >= ADMIN_GATE_TAPS) {
			tapCount.current = 0
			e.preventDefault()
			navigate('/admin')
			return
		}

		tapTimer.current = setTimeout(() => {
			tapCount.current = 0
		}, ADMIN_GATE_WINDOW_MS)
	}

	return (
		<header className='fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 shadow-sm backdrop-blur-xl'>
			<div className='mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:px-4'>
				<Link
					to='/'
					onClick={handleLogoClick}
					className='shrink-0 font-bold tracking-tight text-foreground transition-opacity hover:opacity-70'
				>
					<span className='hidden text-base sm:inline'>YaoYao Dinner</span>
					<span className='inline text-lg font-black text-primary sm:hidden'>
						YY
					</span>
				</Link>

				<nav className='flex min-w-0 items-center gap-0.5 sm:gap-1'>
					<Link
						to='/menu'
						className={cn(
							'rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4',
							pathname === '/menu'
								? 'bg-primary/90 text-primary-foreground shadow-sm'
								: 'text-muted-foreground hover:bg-accent hover:text-foreground'
						)}
					>
						{t('nav.menu')}
					</Link>

					<Link
						to='/tables'
						className={cn(
							'rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4',
							pathname.startsWith('/tables')
								? 'bg-primary/90 text-primary-foreground shadow-sm'
								: 'text-muted-foreground hover:bg-accent hover:text-foreground'
						)}
					>
						{t('nav.tables')}
					</Link>

					{feedbackWall && (
						<Link
							to='/feedback'
							className={cn(
								'rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4',
								pathname === '/feedback'
									? 'bg-primary/90 text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:bg-accent hover:text-foreground'
							)}
						>
							{t('nav.feedback')}
						</Link>
					)}

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

					{isAdmin && (
						<Link
							to='/admin'
							className={cn(
								'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
								pathname.startsWith('/admin')
									? 'bg-primary/90 text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:bg-accent hover:text-foreground'
							)}
						>
							<ShieldCheck className='size-3.5' />
							<span className='hidden sm:inline'>{t('nav.admin')}</span>
						</Link>
					)}
				</nav>

				<div className='flex shrink-0 items-center gap-0.5 sm:gap-1'>
					<LanguageSelector />
					<ThemeToggle />
				</div>
			</div>
		</header>
	)
}
