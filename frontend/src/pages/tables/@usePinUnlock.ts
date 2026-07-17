import { useState } from 'react'
import { useVerifyPin } from '@/api/auth/auth'
import { useGuest } from '@/hooks/useGuest'
import { PIN_LENGTH } from '@/common/constants'

export function usePinUnlock() {
	const [pin, setPin] = useState('')
	const [invalid, setInvalid] = useState(false)
	const setAuth = useGuest(s => s.setAuth)
	const { mutate, isPending } = useVerifyPin()

	const submit = (value: string) => {
		if (value.length < PIN_LENGTH) return
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
