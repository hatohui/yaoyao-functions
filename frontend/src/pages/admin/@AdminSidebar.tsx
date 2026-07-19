import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
	LayoutDashboard,
	LogOut,
	ExternalLink,
	Armchair,
	Users,
	BarChart3,
	MessageSquare,
	UtensilsCrossed,
	ClipboardList,
	SlidersHorizontal,
} from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'
import { cn } from '@/utils/shadcn'

interface AdminSidebarProps {
	onNavigate?: () => void
	className?: string
}

const NAV_ITEMS = [
	{ to: '/admin', labelKey: 'admin.nav.dashboard', icon: LayoutDashboard },
	{ to: '/admin/tables', labelKey: 'admin.nav.tables', icon: Armchair },
	{ to: '/admin/food', labelKey: 'admin.nav.food', icon: UtensilsCrossed },
	{ to: '/admin/presets', labelKey: 'admin.nav.presets', icon: ClipboardList },
	{ to: '/admin/people', labelKey: 'admin.nav.people', icon: Users },
	{ to: '/admin/stats', labelKey: 'admin.nav.stats', icon: BarChart3 },
	{
		to: '/admin/feedback',
		labelKey: 'admin.nav.feedback',
		icon: MessageSquare,
	},
	{
		to: '/admin/settings',
		labelKey: 'admin.nav.settings',
		icon: SlidersHorizontal,
	},
]

export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
	const { t } = useTranslation()
	const { pathname } = useLocation()
	const clear = useAdmin(s => s.clear)

	return (
		<nav className={cn('flex flex-col gap-1', className)}>
			{NAV_ITEMS.map(item => {
				const Icon = item.icon
				const active =
					item.to === '/admin'
						? pathname === '/admin'
						: pathname.startsWith(item.to)
				return (
					<Link
						key={item.to}
						to={item.to}
						onClick={onNavigate}
						className={cn(
							'flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
							active
								? 'bg-primary text-primary-foreground shadow-sm'
								: 'text-muted-foreground hover:bg-accent hover:text-foreground'
						)}
					>
						<Icon className='size-4' />
						{t(item.labelKey)}
					</Link>
				)
			})}

			<div className='my-2 border-t border-border/60' />

			<Link
				to='/'
				onClick={onNavigate}
				className='flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
			>
				<ExternalLink className='size-4' />
				{t('admin.nav.exit')}
			</Link>

			<button
				type='button'
				onClick={() => {
					clear()
					onNavigate?.()
				}}
				className='flex items-center gap-2.5 rounded-full px-4 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10'
			>
				<LogOut className='size-4' />
				{t('admin.nav.lock')}
			</button>
		</nav>
	)
}
