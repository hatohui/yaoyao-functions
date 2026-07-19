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
	alwaysEditable?: boolean
}

export function InlineEdit({
	value,
	onCommit,
	type = 'text',
	placeholder,
	className,
	inputClassName,
	alwaysEditable = false,
}: InlineEditProps) {
	const { editing } = useEditMode()
	const isEditable = alwaysEditable || editing

	if (!isEditable) return <span className={className}>{value}</span>

	return (
		<DebouncedInput
			value={value}
			onCommit={onCommit}
			type={type}
			placeholder={placeholder}
			className={cn(
				'h-auto min-w-[2rem] rounded border-dashed border-primary/50 bg-primary/5 px-1 py-0.5 text-center',
				type === 'number' &&
					'[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]',
				className,
				inputClassName
			)}
		/>
	)
}
