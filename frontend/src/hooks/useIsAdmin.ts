import { useEffect } from 'react'
import { useGetActiveEvent } from '@/api/events/events'
import type { EventSummaryDto } from '@/api/model'
import { useAdmin } from '@/hooks/useAdmin'

export function useIsAdmin() {
	const passphrase = useAdmin(s => s.passphrase)
	const clear = useAdmin(s => s.clear)

	const { isSuccess, isError, isLoading } =
		useGetActiveEvent<EventSummaryDto | null>({
			query: { enabled: Boolean(passphrase), retry: false },
		})

	useEffect(() => {
		if (passphrase && isError) clear()
	}, [passphrase, isError, clear])

	return {
		isAdmin: Boolean(passphrase) && isSuccess,
		isVerifying: Boolean(passphrase) && isLoading,
	}
}
