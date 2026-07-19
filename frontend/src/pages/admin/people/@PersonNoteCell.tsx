import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useUpsertNote } from '@/api/personal-notes/personal-notes'
import { getGetPeopleListQueryKey } from '@/api/stats/stats'
import { DebouncedInput } from '@/components/common/DebouncedInput'
import { useToast } from '@/hooks/useToast'

interface PersonNoteCellProps {
	personId: string
	note: string | null
}

export function PersonNoteCell({ personId, note }: PersonNoteCellProps) {
	const { t } = useTranslation()
	const toast = useToast()
	const qc = useQueryClient()

	const { mutate } = useUpsertNote({
		mutation: {
			onSuccess: () =>
				qc.invalidateQueries({ queryKey: getGetPeopleListQueryKey() }),
			onError: () => toast.error(t('admin.people.note_save_failed')),
		},
	})

	return (
		<DebouncedInput
			value={note ?? ''}
			onCommit={content => {
				if (content.trim() !== (note ?? ''))
					mutate({ data: { personId, content } })
			}}
			placeholder={t('admin.people.note_placeholder')}
			className='h-8 w-full rounded-none border-0 bg-transparent px-2 shadow-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset'
		/>
	)
}
