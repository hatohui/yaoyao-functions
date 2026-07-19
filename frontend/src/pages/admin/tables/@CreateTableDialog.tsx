import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogTrigger,
} from '@/components/ui/dialog'

interface CreateTableDialogProps {
	pending: boolean
	onCreate: (name: string, capacity: number, isStaging: boolean) => void
}

export function CreateTableDialog({
	pending,
	onCreate,
}: CreateTableDialogProps) {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const [capacity, setCapacity] = useState(8)
	const [isStaging, setIsStaging] = useState(false)

	const reset = () => {
		setName('')
		setCapacity(8)
		setIsStaging(false)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={next => {
				setOpen(next)
				if (!next) reset()
			}}
		>
			<DialogTrigger asChild>
				<Button size='sm' className='gap-1.5 rounded-full'>
					<Plus className='size-4' />
					{t('admin.tables.create')}
				</Button>
			</DialogTrigger>
			<DialogContent className='rounded-3xl'>
				<DialogHeader>
					<DialogTitle>{t('admin.tables.create_title')}</DialogTitle>
				</DialogHeader>

				<div className='flex flex-col gap-4'>
					<div className='flex flex-col gap-1.5'>
						<Label htmlFor='table-name'>{t('admin.tables.name')}</Label>
						<Input
							id='table-name'
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder={t('admin.tables.name_placeholder')}
							className='rounded-full'
						/>
					</div>

					<div className='flex flex-col gap-1.5'>
						<Label htmlFor='table-capacity'>{t('admin.tables.capacity')}</Label>
						<Input
							id='table-capacity'
							type='number'
							min={1}
							value={capacity}
							onChange={e => setCapacity(Number(e.target.value) || 1)}
							className='rounded-full'
						/>
					</div>

					<div className='flex items-center justify-between'>
						<Label htmlFor='table-staging'>{t('admin.tables.staged')}</Label>
						<Switch
							id='table-staging'
							checked={isStaging}
							onCheckedChange={setIsStaging}
						/>
					</div>
				</div>

				<DialogFooter>
					<Button
						className='rounded-full'
						disabled={!name.trim() || pending}
						onClick={() => {
							onCreate(name.trim(), capacity, isStaging)
							setOpen(false)
							reset()
						}}
					>
						{t('admin.tables.create')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
