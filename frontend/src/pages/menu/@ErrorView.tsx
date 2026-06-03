import { useTranslation } from 'react-i18next'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorViewProps {
	error: Error
	onRetry?: () => void
}

export function ErrorView({ error, onRetry }: ErrorViewProps) {
	const { t } = useTranslation()

	return (
		<div className='flex flex-col items-center justify-center py-20 text-center'>
			<div className='mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10'>
				<AlertCircle className='h-12 w-12 text-destructive' />
			</div>
			<h3 className='mb-2 text-xl font-semibold'>{t('menu.error_title')}</h3>
			<p className='mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground'>
				{error.message || t('menu.error_desc')}
			</p>
			{onRetry && (
				<Button
					onClick={onRetry}
					className='gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90'
				>
					<RefreshCw className='h-4 w-4' />
					{t('menu.try_again')}
				</Button>
			)}
		</div>
	)
}
