import { useQueryClient } from '@tanstack/react-query'
import {
	useGetNotesByPerson,
	useUpsertNote,
	getGetNotesByPersonQueryKey,
} from '@/api/personal-notes/personal-notes'
import { getGetPeopleListQueryKey } from '@/api/stats/stats'
import type { NoteResponseDto } from '@/api/model'

export function usePersonNote(personId: string) {
	const qc = useQueryClient()

	const { data } = useGetNotesByPerson<NoteResponseDto[]>(
		{ personId },
		{ query: { enabled: Boolean(personId) } }
	)
	const note = (data ?? [])[0] ?? null

	const { mutate } = useUpsertNote({
		mutation: {
			onSettled: () => {
				qc.invalidateQueries({
					queryKey: getGetNotesByPersonQueryKey({ personId }),
				})
				qc.invalidateQueries({ queryKey: getGetPeopleListQueryKey() })
			},
		},
	})

	return {
		note,
		save: (content: string) => mutate({ data: { personId, content } }),
	}
}
