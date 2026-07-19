import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { AdminUnlock } from '@/components/common/AdminUnlock'
import { Spinner } from '@/components/ui/spinner'
import { AdminSidebar } from './@AdminSidebar'

const AdminLayout = ({
	children,
}: {
	children: React.ReactNode
}): React.ReactElement => {
	const { t } = useTranslation()
	const passphrase = useAdmin(s => s.passphrase)
	const { isAdmin, isVerifying } = useIsAdmin()
	const [mobileNavOpen, setMobileNavOpen] = useState(false)

	if (!passphrase) return <AdminUnlock />
	if (isVerifying) {
		return (
			<div className='flex min-h-[calc(100vh-3.5rem)] items-center justify-center'>
				<Spinner />
			</div>
		)
	}
	if (!isAdmin) return <AdminUnlock />

	return (
		<div className='mx-auto flex max-w-6xl gap-6 px-4 py-6 lg:pl-0'>
			<aside className='hidden w-56 shrink-0 lg:block'>
				<div className='sticky top-20 flex flex-col gap-4'>
					<p className='px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
						{t('admin.nav.title')}
					</p>
					<AdminSidebar />
				</div>
			</aside>

			<div className='min-w-0 flex-1'>
				<div className='mb-4 flex items-center justify-between lg:hidden'>
					<p className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
						{t('admin.nav.title')}
					</p>
					<button
						type='button'
						onClick={() => setMobileNavOpen(v => !v)}
						aria-label={t('admin.nav.toggle')}
						className='flex size-9 items-center justify-center rounded-full border border-border/60 bg-card text-foreground'
					>
						{mobileNavOpen ? (
							<X className='size-4' />
						) : (
							<Menu className='size-4' />
						)}
					</button>
				</div>

				{mobileNavOpen && (
					<div className='mb-4 rounded-2xl border border-border/60 bg-card p-2 shadow-sm lg:hidden'>
						<AdminSidebar onNavigate={() => setMobileNavOpen(false)} />
					</div>
				)}

				{children}
			</div>
		</div>
	)
}

export default AdminLayout
