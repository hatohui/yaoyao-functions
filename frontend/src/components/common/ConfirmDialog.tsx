import { useTranslation } from 'react-i18next'
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { cn } from '@/utils/shadcn'
import { buttonVariants } from '@/components/ui/button'

interface ConfirmDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description?: string
	confirmLabel?: string
	destructive?: boolean
	onConfirm: () => void
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel,
	destructive = true,
	onConfirm,
}: ConfirmDialogProps) {
	const { t } = useTranslation()

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className='rounded-3xl'>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description && <AlertDialogDescription>{description}</AlertDialogDescription>}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className='rounded-full'>{t('common.cancel')}</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className={cn(
							'rounded-full',
							destructive &&
								buttonVariants({ variant: 'destructive' })
						)}
					>
						{confirmLabel ?? t('common.confirm')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
