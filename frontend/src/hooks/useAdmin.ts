import { create } from 'zustand'
import { localStorage } from '@/utils/localstorage'
import { ADMIN_PASSPHRASE_STORAGE_KEY } from '@/common/constants'

interface AdminState {
	passphrase: string | null
	setPassphrase: (passphrase: string) => void
	clear: () => void
}

export const useAdmin = create<AdminState>(set => ({
	passphrase: localStorage.load(ADMIN_PASSPHRASE_STORAGE_KEY),
	setPassphrase: passphrase => {
		localStorage.save(ADMIN_PASSPHRASE_STORAGE_KEY, passphrase)
		set({ passphrase })
	},
	clear: () => {
		localStorage.remove(ADMIN_PASSPHRASE_STORAGE_KEY)
		set({ passphrase: null })
	},
}))
