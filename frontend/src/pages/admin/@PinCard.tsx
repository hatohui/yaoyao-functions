import { useTranslation } from 'react-i18next'
import { Copy, KeyRound } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PinCardProps {
	pin: string
	name?: string | null
	onCopy: () => void
}

export function PinCard({ pin, name, onCopy }: PinCardProps) {
	const { t } = useTranslation()

	return (
		<Card className='flex-row items-center justify-between gap-3 rounded-2xl px-5 py-4'>
			<div className='flex items-center gap-3'>
				<div className='flex size-10 items-center justify-center rounded-full bg-brand-muted text-primary'>
					<KeyRound className='size-5' />
				</div>
				<div>
					<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
						{name || t('admin.dashboard.current_event')}
					</p>
					<p className='text-2xl font-bold tracking-[0.3em] text-foreground'>
						{pin}
					</p>
				</div>
			</div>
			<Button
				type='button'
				variant='outline'
				size='sm'
				className='gap-1.5 rounded-full'
				onClick={onCopy}
			>
				<Copy className='size-3.5' />
				{t('admin.dashboard.copy_pin')}
			</Button>
		</Card>
	)
}
