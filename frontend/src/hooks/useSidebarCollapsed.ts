import { create } from 'zustand'
import { localStorage } from '@/utils/localstorage'
import { ADMIN_SIDEBAR_COLLAPSED_STORAGE_KEY } from '@/common/constants'

interface SidebarState {
	collapsed: boolean
	toggle: () => void
}

export const useSidebarCollapsed = create<SidebarState>(set => ({
	collapsed: localStorage.load(ADMIN_SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true',
	toggle: () =>
		set(s => {
			localStorage.save(
				ADMIN_SIDEBAR_COLLAPSED_STORAGE_KEY,
				String(!s.collapsed)
			)
			return { collapsed: !s.collapsed }
		}),
}))
