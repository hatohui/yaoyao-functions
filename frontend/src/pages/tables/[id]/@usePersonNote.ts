import { useQueryClient } from '@tanstack/react-query'
import {
	useGetNotesByPerson,
	useCreateNote,
	useDeleteNote,
	getGetNotesByPersonQueryKey,
} from '@/api/personal-notes/personal-notes'
import type { NoteResponseDto } from '@/api/model'

export function usePersonNote(personId: string) {
	const qc = useQueryClient()
	const notesKey = getGetNotesByPersonQueryKey({ personId })

	const { data } = useGetNotesByPerson<NoteResponseDto[]>({ personId })
	const note = (data ?? [])[0] ?? null

	const invalidate = () => qc.invalidateQueries({ queryKey: notesKey })

	const { mutate: createNote } = useCreateNote({
		mutation: { onSettled: invalidate },
	})
	const { mutate: deleteNote } = useDeleteNote({
		mutation: { onSettled: invalidate },
	})

	const save = (content: string) => {
		const trimmed = content.trim()
		if (note) deleteNote({ id: note.id })
		if (trimmed) createNote({ data: { personId, content: trimmed } })
	}

	return { note, save }
}
