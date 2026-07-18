import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PersonDto } from '@/api/model'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/shadcn'

type SplitMode = 'me' | 'table' | 'choose'

interface SplitPickerModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	people: PersonDto[]
	initialPersonIds: string[]
	initialSplitAll: boolean
	myPersonId?: string | null
	onConfirm: (splitAll: boolean, personIds: string[]) => void
}

export function SplitPickerModal({
	open,
	onOpenChange,
	people,
	initialPersonIds,
	initialSplitAll,
	myPersonId,
	onConfirm,
}: SplitPickerModalProps) {
	const { t } = useTranslation()
	const [mode, setMode] = useState<SplitMode>('table')
	const [chosen, setChosen] = useState<Set<string>>(new Set())

	useEffect(() => {
		if (!open) return
		if (initialSplitAll) {
			setMode('table')
			setChosen(new Set())
		} else if (
			myPersonId &&
			initialPersonIds.length === 1 &&
			initialPersonIds[0] === myPersonId
		) {
			setMode('me')
			setChosen(new Set(initialPersonIds))
		} else {
			setMode('choose')
			setChosen(new Set(initialPersonIds))
		}
	}, [open, initialSplitAll, initialPersonIds, myPersonId])

	const toggle = (id: string) => {
		setChosen(prev => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	const confirm = () => {
		if (mode === 'table') return onConfirm(true, [])
		if (mode === 'me' && myPersonId) return onConfirm(false, [myPersonId])
		onConfirm(false, [...chosen])
	}

	const canConfirm = mode !== 'choose' || chosen.size > 0

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='rounded-3xl'>
				<DialogHeader>
					<DialogTitle>{t('split.title')}</DialogTitle>
				</DialogHeader>

				<RadioGroup
					value={mode}
					onValueChange={v => setMode(v as SplitMode)}
					className='gap-3'
				>
					<label className='flex items-center gap-2.5 text-sm font-medium text-foreground'>
						<RadioGroupItem value='me' disabled={!myPersonId} />
						{t('split.just_me')}
					</label>
					<label className='flex items-center gap-2.5 text-sm font-medium text-foreground'>
						<RadioGroupItem value='table' />
						{t('split.whole_table')}
					</label>
					<label className='flex items-center gap-2.5 text-sm font-medium text-foreground'>
						<RadioGroupItem value='choose' />
						{t('split.choose_people')}
					</label>
				</RadioGroup>

				{mode === 'choose' && (
					<div className='flex flex-wrap gap-2'>
						{people.map(person => (
							<button
								key={person.id}
								type='button'
								onClick={() => toggle(person.id)}
								className={cn(
									'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
									chosen.has(person.id)
										? 'border-primary bg-primary text-primary-foreground'
										: 'border-border/60 bg-card text-foreground hover:bg-muted'
								)}
							>
								{person.name}
							</button>
						))}
					</div>
				)}

				<DialogFooter>
					<Button
						className='rounded-full'
						disabled={!canConfirm}
						onClick={confirm}
					>
						{t('common.confirm')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
