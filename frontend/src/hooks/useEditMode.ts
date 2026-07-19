import { create } from 'zustand'
import { localStorage } from '@/utils/localstorage'
import { ADMIN_EDIT_MODE_STORAGE_KEY } from '@/common/constants'
import { useIsAdmin } from './useIsAdmin'

interface EditModeState {
  enabled: boolean
  toggle: () => void
  set: (enabled: boolean) => void
}

const useEditModeStore = create<EditModeState>(set => ({
  enabled: localStorage.load(ADMIN_EDIT_MODE_STORAGE_KEY) === 'true',
  toggle: () =>
    set(s => {
      localStorage.save(ADMIN_EDIT_MODE_STORAGE_KEY, String(!s.enabled))
      return { enabled: !s.enabled }
    }),
  set: enabled => {
    localStorage.save(ADMIN_EDIT_MODE_STORAGE_KEY, String(enabled))
    set({ enabled })
  },
}))

/**
 * Edit mode only ever unlocks fields for a verified admin - a stale localStorage
 * flag on a guest device must not make guest-facing pages look editable.
 */
export function useEditMode() {
  const { isAdmin } = useIsAdmin()
  const enabled = useEditModeStore(s => s.enabled)
  const toggle = useEditModeStore(s => s.toggle)

  return { isAdmin, editing: isAdmin && enabled, toggle }
}
