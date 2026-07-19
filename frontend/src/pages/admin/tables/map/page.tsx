import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { AdminFloorPlanCanvas } from './@AdminFloorPlanCanvas'
import { useAdminFloorPlan } from './@useAdminFloorPlan'

export default function AdminFloorPlanPage() {
	const { t } = useTranslation()
	const { tables, isLoading, isError, setPosition, commitPosition } =
		useAdminFloorPlan()

	return (
		<div className='flex flex-col gap-4'>
			<Link
				to='/admin/tables'
				className='inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
			>
				<ArrowLeft className='size-4' />
				{t('admin.tables.title')}
			</Link>

			<div>
				<h1 className='text-xl font-bold text-foreground'>
					{t('floor_plan.title')}
				</h1>
				<p className='text-sm text-muted-foreground'>
					{t('admin.floor_plan.drag_hint')}
				</p>
			</div>

			{isLoading ? (
				<div className='flex justify-center py-16'>
					<Spinner />
				</div>
			) : isError ? (
				<p className='py-16 text-center text-sm text-muted-foreground'>
					{t('tables.load_error')}
				</p>
			) : (
				<AdminFloorPlanCanvas
					tables={tables}
					onDrag={setPosition}
					onDrop={commitPosition}
				/>
			)}
		</div>
	)
}
