import { create } from 'zustand'
import { localStorage } from '@/utils/localstorage'
import { ADMIN_EVENT_ID_STORAGE_KEY } from '@/common/constants'

interface AdminEventState {
	/** null means "follow whatever event is currently live" */
	eventId: string | null
	setEventId: (eventId: string | null) => void
}

export const useAdminEvent = create<AdminEventState>(set => ({
	eventId: localStorage.load(ADMIN_EVENT_ID_STORAGE_KEY),
	setEventId: eventId => {
		if (eventId) localStorage.save(ADMIN_EVENT_ID_STORAGE_KEY, eventId)
		else localStorage.remove(ADMIN_EVENT_ID_STORAGE_KEY)
		set({ eventId })
	},
}))
