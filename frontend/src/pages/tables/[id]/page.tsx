import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowLeft, Share2, Users } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Roster } from './@Roster'
import { useTableDetail } from './@useTableDetail'

export default function TableDetailPage() {
	const { t } = useTranslation()
	const { table, isLoading, isError, shareLink } = useTableDetail()

	if (isLoading) {
		return (
			<div className='flex justify-center py-20'>
				<Spinner />
			</div>
		)
	}

	if (isError || !table) {
		return (
			<p className='py-20 text-center text-sm text-muted-foreground'>{t('roster.not_found')}</p>
		)
	}

	return (
		<div className='mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6'>
			<Link
				to='/tables'
				className='inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
			>
				<ArrowLeft className='size-4' />
				{t('tables.all_tables')}
			</Link>

			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<h1 className='text-xl font-bold text-foreground'>{table.name}</h1>
					<span className='flex items-center gap-1 rounded-full bg-brand-muted px-2.5 py-1 text-xs font-medium text-primary'>
						<Users className='size-3.5' />
						{table.seated}/{table.capacity}
					</span>
				</div>
				<button
					type='button'
					onClick={shareLink}
					className='inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
				>
					<Share2 className='size-4' />
					{t('roster.share')}
				</button>
			</div>

			<Roster table={table} />
		</div>
	)
}
