import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface PublishEventDialogProps {
	hasActiveEvent: boolean
	pending: boolean
	onPublish: (name: string) => void
}

export function PublishEventDialog({
	hasActiveEvent,
	pending,
	onPublish,
}: PublishEventDialogProps) {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')

	return (
		<AlertDialog
			open={open}
			onOpenChange={next => {
				setOpen(next)
				if (!next) setName('')
			}}
		>
			<AlertDialogTrigger asChild>
				<Button className='gap-1.5 rounded-full'>
					<Sparkles className='size-4' />
					{t('admin.dashboard.publish')}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className='rounded-3xl'>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t('admin.dashboard.publish_title')}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{hasActiveEvent
							? t('admin.dashboard.publish_desc_active')
							: t('admin.dashboard.publish_desc_empty')}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<Input
					value={name}
					onChange={e => setName(e.target.value)}
					placeholder={t('admin.dashboard.publish_name_placeholder')}
					className='rounded-full'
				/>

				<AlertDialogFooter>
					<AlertDialogCancel className='rounded-full'>
						{t('common.cancel')}
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={pending}
						onClick={e => {
							e.preventDefault()
							onPublish(name)
							setOpen(false)
							setName('')
						}}
						className='rounded-full'
					>
						{pending
							? t('admin.dashboard.publishing')
							: t('admin.dashboard.publish')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
