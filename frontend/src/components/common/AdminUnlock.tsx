import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdminUnlock } from '@/hooks/useAdminUnlock'

export function AdminUnlock() {
	const { t } = useTranslation()
	const { passphrase, onChange, submit, invalid, isPending } = useAdminUnlock()

	return (
		<div className='mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col px-4 py-6'>
			<Link
				to='/'
				className='inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
			>
				<ArrowLeft className='size-4' />
				{t('access.back')}
			</Link>

			<form
				onSubmit={e => {
					e.preventDefault()
					submit()
				}}
				className='flex flex-1 flex-col items-center justify-center gap-6 text-center'
			>
				<div className='flex size-14 items-center justify-center rounded-2xl bg-brand-muted text-primary'>
					<ShieldCheck className='size-6' />
				</div>

				<div className='space-y-1.5'>
					<h1 className='text-2xl font-bold text-foreground'>
						{t('admin.gate.title')}
					</h1>
					<p className='text-sm text-muted-foreground'>
						{t('admin.gate.subtitle')}
					</p>
				</div>

				<Input
					type='password'
					value={passphrase}
					onChange={e => onChange(e.target.value)}
					placeholder={t('admin.gate.placeholder')}
					autoFocus
					className='rounded-full text-center'
				/>

				{invalid && (
					<p className='text-sm font-medium text-destructive'>
						{t('admin.gate.invalid')}
					</p>
				)}

				<Button
					type='submit'
					size='lg'
					className='w-44 rounded-full'
					disabled={!passphrase || isPending}
				>
					{isPending ? t('admin.gate.unlocking') : t('admin.gate.unlock')}
				</Button>
			</form>
		</div>
	)
}
