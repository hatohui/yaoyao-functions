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
import { Button } from '@/components/ui/button'
import { usePersonNote } from '@/hooks/usePersonNote'

interface PersonNoteDialogProps {
	person: PersonDto | null
	onOpenChange: (open: boolean) => void
}

export function PersonNoteDialog({
	person,
	onOpenChange,
}: PersonNoteDialogProps) {
	const { t } = useTranslation()
	const { note, save } = usePersonNote(person?.id ?? '')
	const [draft, setDraft] = useState('')

	useEffect(() => {
		if (person) setDraft(note?.content ?? '')
	}, [person, note?.content])

	return (
		<Dialog open={person !== null} onOpenChange={onOpenChange}>
			<DialogContent className='rounded-3xl'>
				<DialogHeader>
					<DialogTitle>{t('notes.title', { name: person?.name })}</DialogTitle>
				</DialogHeader>

				<textarea
					value={draft}
					onChange={e => setDraft(e.target.value)}
					placeholder={t('notes.placeholder')}
					rows={3}
					className='w-full rounded-2xl border border-border/60 bg-transparent px-4 py-3 text-sm text-foreground outline-none focus:border-primary'
				/>

				<DialogFooter>
					<Button
						className='rounded-full'
						onClick={() => {
							save(draft)
							onOpenChange(false)
						}}
					>
						{t('common.save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
