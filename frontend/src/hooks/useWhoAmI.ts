import { useCallback, useState } from 'react'
import { localStorage } from '@/utils/localstorage'
import { WHOAMI_STORAGE_KEY } from '@/common/constants'

type WhoAmIMap = Record<string, string>

const readMap = (): WhoAmIMap => {
	const raw = localStorage.load(WHOAMI_STORAGE_KEY)
	if (!raw) return {}
	try {
		return JSON.parse(raw) as WhoAmIMap
	} catch {
		return {}
	}
}

export function useWhoAmI(tableId: string) {
	const [personId, setPersonIdState] = useState<string | null>(
		() => readMap()[tableId] ?? null
	)

	const setPersonId = useCallback(
		(id: string) => {
			const map = readMap()
			map[tableId] = id
			localStorage.save(WHOAMI_STORAGE_KEY, JSON.stringify(map))
			setPersonIdState(id)
		},
		[tableId]
	)

	return { personId, setPersonId }
}
