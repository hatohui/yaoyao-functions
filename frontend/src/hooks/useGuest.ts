import { create } from 'zustand'
import { localStorage } from '@/utils/localstorage'
import {
	PIN_STORAGE_KEY,
	EVENT_ID_STORAGE_KEY,
	GUEST_NAME_STORAGE_KEY,
	ACTIVE_TABLE_ID_STORAGE_KEY,
} from '@/common/constants'

interface GuestState {
	pin: string | null
	eventId: string | null
	name: string | null
	activeTableId: string | null
	setAuth: (pin: string, eventId: string) => void
	setName: (name: string) => void
	setActiveTable: (tableId: string) => void
	clear: () => void
}

export const useGuest = create<GuestState>(set => ({
	pin: localStorage.load(PIN_STORAGE_KEY),
	eventId: localStorage.load(EVENT_ID_STORAGE_KEY),
	name: localStorage.load(GUEST_NAME_STORAGE_KEY),
	activeTableId: localStorage.load(ACTIVE_TABLE_ID_STORAGE_KEY),
	setAuth: (pin, eventId) => {
		localStorage.save(PIN_STORAGE_KEY, pin)
		localStorage.save(EVENT_ID_STORAGE_KEY, eventId)
		set({ pin, eventId })
	},
	setName: name => {
		localStorage.save(GUEST_NAME_STORAGE_KEY, name)
		set({ name })
	},
	setActiveTable: tableId => {
		localStorage.save(ACTIVE_TABLE_ID_STORAGE_KEY, tableId)
		set({ activeTableId: tableId })
	},
	clear: () => {
		localStorage.remove(PIN_STORAGE_KEY)
		localStorage.remove(EVENT_ID_STORAGE_KEY)
		set({ pin: null, eventId: null })
	},
}))
