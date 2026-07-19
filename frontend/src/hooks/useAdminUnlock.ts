import { useState } from 'react'
import { useVerifyAdmin } from '@/api/auth/auth'
import { useAdmin } from '@/hooks/useAdmin'

export function useAdminUnlock() {
	const [passphrase, setPassphrase] = useState('')
	const [invalid, setInvalid] = useState(false)
	const setStoredPassphrase = useAdmin(s => s.setPassphrase)
	const { mutate, isPending } = useVerifyAdmin()

	const submit = () => {
		if (!passphrase) return
		setInvalid(false)
		mutate(
			{ data: { passphrase } },
			{
				onSuccess: res => {
					if (res.valid) setStoredPassphrase(passphrase)
					else {
						setInvalid(true)
						setPassphrase('')
					}
				},
				onError: () => setInvalid(true),
			}
		)
	}

	const onChange = (value: string) => {
		setPassphrase(value)
		if (invalid) setInvalid(false)
	}

	return { passphrase, onChange, submit, invalid, isPending }
}
