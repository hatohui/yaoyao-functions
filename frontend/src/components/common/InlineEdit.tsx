import { DebouncedInput } from '@/components/common/DebouncedInput'
import { useEditMode } from '@/hooks/useEditMode'
import { cn } from '@/utils/shadcn'

interface InlineEditProps {
	value: string
	onCommit: (value: string) => void
	type?: 'text' | 'number'
	placeholder?: string
	/** Applied to the read-only rendering so the field keeps the page's typography */
	className?: string
	inputClassName?: string
}

export function InlineEdit({
	value,
	onCommit,
	type = 'text',
	placeholder,
	className,
	inputClassName,
}: InlineEditProps) {
	const { editing } = useEditMode()

	if (!editing) return <span className={className}>{value}</span>

	return (
		<DebouncedInput
			value={value}
			onCommit={onCommit}
			type={type}
			placeholder={placeholder}
			className={cn(
				'h-auto rounded-xl border-dashed border-primary/50 bg-primary/5 px-2 py-1',
				className,
				inputClassName
			)}
		/>
	)
}
