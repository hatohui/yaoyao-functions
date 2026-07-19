import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogTrigger,
} from '@/components/ui/dialog'

interface BulkCreateDialogProps {
	pending: boolean
	onCreate: (count: number, capacity: number, isStaging: boolean) => void
}

export function BulkCreateDialog({ pending, onCreate }: BulkCreateDialogProps) {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)
	const [count, setCount] = useState(10)
	const [capacity, setCapacity] = useState(8)
	const [isStaging, setIsStaging] = useState(true)

	const reset = () => {
		setCount(10)
		setCapacity(8)
		setIsStaging(true)
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
				<Button size='sm' variant='outline' className='gap-1.5 rounded-full'>
					<Layers className='size-4' />
					{t('admin.tables.bulk_create')}
				</Button>
			</DialogTrigger>
			<DialogContent className='rounded-3xl'>
				<DialogHeader>
					<DialogTitle>{t('admin.tables.bulk_create_title')}</DialogTitle>
					<DialogDescription>
						{t('admin.tables.bulk_create_desc')}
					</DialogDescription>
				</DialogHeader>

				<div className='flex flex-col gap-4'>
					<div className='flex flex-col gap-1.5'>
						<Label htmlFor='bulk-count'>{t('admin.tables.count')}</Label>
						<Input
							id='bulk-count'
							type='number'
							min={1}
							max={100}
							value={count}
							onChange={e => setCount(Number(e.target.value) || 1)}
							className='rounded-full'
						/>
					</div>

					<div className='flex flex-col gap-1.5'>
						<Label htmlFor='bulk-capacity'>{t('admin.tables.capacity')}</Label>
						<Input
							id='bulk-capacity'
							type='number'
							min={1}
							value={capacity}
							onChange={e => setCapacity(Number(e.target.value) || 1)}
							className='rounded-full'
						/>
					</div>

					<div className='flex items-center justify-between'>
						<Label htmlFor='bulk-staging'>{t('admin.tables.staged')}</Label>
						<Switch
							id='bulk-staging'
							checked={isStaging}
							onCheckedChange={setIsStaging}
						/>
					</div>
				</div>

				<DialogFooter>
					<Button
						className='rounded-full'
						disabled={count < 1 || pending}
						onClick={() => {
							onCreate(count, capacity, isStaging)
							setOpen(false)
							reset()
						}}
					>
						{t('admin.tables.bulk_create')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
