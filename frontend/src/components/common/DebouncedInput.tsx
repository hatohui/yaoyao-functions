import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/shadcn'

interface DebouncedInputProps {
	value: string
	onCommit: (value: string) => void
	delay?: number
	className?: string
	placeholder?: string
	type?: 'text' | 'number'
}

export function DebouncedInput({
	value,
	onCommit,
	delay = 500,
	className,
	placeholder,
	type = 'text',
}: DebouncedInputProps) {
	const [local, setLocal] = useState(value)
	const isEditingRef = useRef(false)
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => {
		if (!isEditingRef.current) setLocal(value)
	}, [value])

	useEffect(() => () => clearTimeout(debounceRef.current), [])

	const handleChange = (next: string) => {
		setLocal(next)
		clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => onCommit(next), delay)
	}

	return (
		<Input
			type={type}
			value={local}
			onFocus={() => {
				isEditingRef.current = true
			}}
			onChange={e => handleChange(e.target.value)}
			onBlur={() => {
				isEditingRef.current = false
				clearTimeout(debounceRef.current)
				onCommit(local)
			}}
			onKeyDown={e => {
				if (e.key === 'Enter') e.currentTarget.blur()
			}}
			placeholder={placeholder}
			className={cn(className)}
		/>
	)
}
