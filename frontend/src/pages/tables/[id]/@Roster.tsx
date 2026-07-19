import { useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { X, NotebookText, Crown } from 'lucide-react'
import type { PersonDto, TableDto } from '@/api/model'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useWhoAmI } from '@/hooks/useWhoAmI'
import { cn } from '@/utils/shadcn'
import { useRoster } from './@useRoster'
import { PersonNoteDialog } from './@PersonNoteDialog'

interface RosterProps {
	table: TableDto
	onSetHost: (personId: string | null) => void
}

export function Roster({ table, onSetHost }: RosterProps) {
	const { t } = useTranslation()
	const { people, add, remove } = useRoster(table.id)
	const { personId: myPersonId } = useWhoAmI(table.id)
	const [pending, setPending] = useState<PersonDto | null>(null)
	const [noteFor, setNoteFor] = useState<PersonDto | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') return
		const input = e.currentTarget
		add(input.value)
		input.value = ''
		inputRef.current?.focus()
	}

	return (
		<div className='flex flex-col gap-3'>
			<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
				{t('roster.people_here')}
			</p>

			{people.length === 0 ? (
				<p className='py-6 text-center text-sm text-muted-foreground'>
					{t('roster.empty')}
				</p>
			) : (
				<ul className='flex flex-col gap-2'>
					{people.map(person => (
						<li
							key={person.id}
							className='flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm'
						>
							<span className='font-medium text-foreground'>
								{person.name}
								{person.id === table.tableLeaderId && (
									<span className='ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground'>
										{t('roster.host')}
									</span>
								)}
							</span>
							<div className='flex items-center gap-1'>
								<button
									type='button'
									onClick={() =>
										onSetHost(
											person.id === table.tableLeaderId ? null : person.id
										)
									}
									aria-pressed={person.id === table.tableLeaderId}
									title={
										person.id === table.tableLeaderId
											? t('roster.unset_host')
											: t('roster.set_host')
									}
									aria-label={
										person.id === table.tableLeaderId
											? t('roster.unset_host')
											: t('roster.set_host')
									}
									className={cn(
										'rounded-full p-1 transition-colors',
										person.id === table.tableLeaderId
											? 'text-primary hover:bg-accent'
											: 'text-muted-foreground hover:bg-muted hover:text-foreground'
									)}
								>
									<Crown className='size-4' />
								</button>
								<button
									type='button'
									onClick={() => setNoteFor(person)}
									aria-label={t('notes.title', { name: person.name })}
									className='rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
								>
									<NotebookText className='size-4' />
								</button>
								<button
									type='button'
									onClick={() => setPending(person)}
									aria-label={t('roster.remove')}
									className='rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
								>
									<X className='size-4' />
								</button>
							</div>
						</li>
					))}
				</ul>
			)}

			<input
				ref={inputRef}
				onKeyDown={handleKeyDown}
				placeholder={t('roster.add_placeholder')}
				className='rounded-2xl border border-dashed border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary'
			/>

			<ConfirmDialog
				open={pending !== null}
				onOpenChange={open => !open && setPending(null)}
				title={t('roster.remove_title', {
					name: pending?.name,
					table: table.name,
				})}
				description={t('roster.remove_desc')}
				confirmLabel={t('roster.remove')}
				onConfirm={() => {
					if (pending) remove(pending.id)
					setPending(null)
				}}
			/>

			<PersonNoteDialog
				person={noteFor}
				isMe={noteFor?.id === myPersonId}
				onOpenChange={open => !open && setNoteFor(null)}
			/>
		</div>
	)
}
