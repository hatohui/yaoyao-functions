import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'

export function LoadingView() {
	return (
		<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
			{Array.from({ length: 8 }).map((_, i) => (
				<div
					key={i}
					className='overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm'
				>
					<Skeleton className='aspect-[4/3] w-full rounded-none' />
					<div className='space-y-2.5 p-4'>
						<Skeleton className='h-5 w-4/5 rounded-lg' />
						<Skeleton className='h-3.5 w-full rounded-lg' />
						<Skeleton className='h-3.5 w-2/3 rounded-lg' />
					</div>
				</div>
			))}
		</div>
	)
}

export function LoadingSpinner() {
	return (
		<div className='flex min-h-[300px] items-center justify-center'>
			<Spinner className='h-8 w-8 text-primary' />
		</div>
	)
}
