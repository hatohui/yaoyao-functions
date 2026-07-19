import React from 'react'
import { useGuest } from '@/hooks/useGuest'
import { PinUnlock } from '@/components/common/PinUnlock'

const MenuLayout = ({
	children,
}: {
	children: React.ReactNode
}): React.ReactElement => {
	const pin = useGuest(s => s.pin)
	if (!pin) return <PinUnlock />
	return <>{children}</>
}

export default MenuLayout
