import { useTranslation } from 'react-i18next'
import { PencilLine } from 'lucide-react'
import { useEditMode } from '@/hooks/useEditMode'
import { cn } from '@/utils/shadcn'

export function EditModeToggle({ className }: { className?: string }) {
	const { t } = useTranslation()
	const { isAdmin, editing, toggle } = useEditMode()

	if (!isAdmin) return null

	return (
		<button
			type='button'
			onClick={toggle}
			aria-pressed={editing}
			title={t('admin.edit_mode.label')}
			className={cn(
				'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
				editing
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border/60 text-muted-foreground hover:text-foreground',
				className
			)}
		>
			<PencilLine className='size-3.5' />
			{editing ? t('admin.edit_mode.on') : t('admin.edit_mode.label')}
		</button>
	)
}
