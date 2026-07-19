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
			onMutate: async ({ data: { personId, content } }) => {
				const notesKey = getGetNotesByPersonQueryKey({ personId })
				await qc.cancelQueries({ queryKey: notesKey })
				const prevNotes = qc.getQueryData<NoteResponseDto[]>(notesKey)

				const optimisticNote: NoteResponseDto = {
					id: `temp-${Date.now()}`,
					content,
					personId,
				}

				qc.setQueryData<NoteResponseDto[]>(notesKey, () => [optimisticNote])

				qc.setQueriesData<any[]>({
					predicate: query => {
						const key = query.queryKey[0]
						return typeof key === 'string' && 
							(key.startsWith('/api/tables') || key.startsWith('/api/stats'))
					}
				}, (old) => {
					if (!Array.isArray(old)) return old
					return old.map(p => 
						p?.id === personId 
							? { ...p, personalNotes: [optimisticNote] }
							: p
					)
				})

				return { prevNotes }
			},
			onError: (_err, _vars, context) => {
				if (context?.prevNotes) {
					qc.setQueryData(getGetNotesByPersonQueryKey({ personId }), context.prevNotes)
				}
				qc.invalidateQueries({
					predicate: query => {
						const key = query.queryKey[0]
						return typeof key === 'string' && 
							(key.startsWith('/api/tables') || key.startsWith('/api/stats'))
					}
				})
			},
			onSettled: () => {
				qc.invalidateQueries({
					queryKey: getGetNotesByPersonQueryKey({ personId }),
				})
				qc.invalidateQueries({ queryKey: getGetPeopleListQueryKey() })
				qc.invalidateQueries({
					predicate: query => {
						const key = query.queryKey[0]
						return typeof key === 'string' && 
							key.startsWith('/api/tables')
					}
				})
			},
		},
	})

	return {
		note,
		save: (content: string) => mutate({ data: { personId, content } }),
	}
}
