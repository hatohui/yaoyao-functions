import { useState } from 'react'
import { useVerifyPin } from '@/api/auth/auth'
import { useGuest } from '@/hooks/useGuest'
import { useConfig } from '@/hooks/useConfig'

export function usePinUnlock() {
	const [pin, setPin] = useState('')
	const [invalid, setInvalid] = useState(false)
	const setAuth = useGuest(s => s.setAuth)
	const { pinLength } = useConfig()
	const { mutate, isPending } = useVerifyPin()

	const submit = (value: string) => {
		if (value.length < pinLength) return
		setInvalid(false)
		mutate(
			{ data: { pin: value } },
			{
				onSuccess: res => {
					if (res.valid && res.eventId) setAuth(value, res.eventId)
					else {
						setInvalid(true)
						setPin('')
					}
				},
				onError: () => setInvalid(true),
			}
		)
	}

	const onChange = (value: string) => {
		setPin(value)
		if (invalid) setInvalid(false)
	}

	return { pin, onChange, submit, invalid, isPending }
}
