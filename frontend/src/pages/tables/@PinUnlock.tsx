import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowLeft, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PinInput } from '@/components/common/PinInput'
import { PIN_LENGTH } from '@/common/constants'
import { usePinUnlock } from './@usePinUnlock'

export function PinUnlock() {
	const { t } = useTranslation()
	const { pin, onChange, submit, invalid, isPending } = usePinUnlock()

	return (
		<div className='mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col px-4 py-6'>
			<Link
				to='/'
				className='inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
			>
				<ArrowLeft className='size-4' />
				{t('access.back')}
			</Link>

			<div className='flex flex-1 flex-col items-center justify-center gap-6 text-center'>
				<div className='flex size-14 items-center justify-center rounded-2xl bg-brand-muted text-primary'>
					<Lock className='size-6' />
				</div>

				<div className='space-y-1.5'>
					<h1 className='text-2xl font-bold text-foreground'>
						{t('access.enter_pin')}
					</h1>
					<p className='text-sm text-muted-foreground'>
						{t('access.subtitle')}
					</p>
				</div>

				<PinInput
					value={pin}
					onChange={onChange}
					length={PIN_LENGTH}
					invalid={invalid}
					autoFocus
					onComplete={submit}
				/>

				{invalid && (
					<p className='text-sm font-medium text-destructive'>
						{t('access.invalid_pin')}
					</p>
				)}

				<Button
					size='lg'
					className='w-44 rounded-full'
					disabled={pin.length < PIN_LENGTH || isPending}
					onClick={() => submit(pin)}
				>
					{isPending ? t('access.unlocking') : t('access.unlock')}
				</Button>

				<p className='text-xs text-muted-foreground'>
					{t('access.saved_note')}
				</p>
			</div>
		</div>
	)
}
