import { useTranslation } from 'react-i18next'
import type { FeedbackItemDto } from '@/api/model'
import { useConfig } from '@/hooks/useConfig'
import { cn } from '@/utils/shadcn'

interface FeedbackCardProps {
	item: FeedbackItemDto
	onReact: (emoji: string) => void
}

export function FeedbackCard({ item, onReact }: FeedbackCardProps) {
	const { t, i18n } = useTranslation()
	const { suggestedReactions } = useConfig()

	return (
		<div className='flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-4 shadow-sm'>
			<div className='flex items-center justify-between'>
				<span className='text-sm font-semibold text-foreground'>
					{item.by || t('feedback.anonymous')}
				</span>
				<span className='text-xs text-muted-foreground'>
					{new Intl.DateTimeFormat(i18n.language, {
						dateStyle: 'medium',
						timeStyle: 'short',
					}).format(new Date(item.createdAt))}
				</span>
			</div>
			{item.content && (
				<p className='text-sm text-foreground'>{item.content}</p>
			)}

			<div className='flex flex-wrap items-center gap-1.5 pt-1'>
				{suggestedReactions.map(emoji => {
					const reaction = item.reactions.find(r => r.emoji === emoji)
					return (
						<button
							key={emoji}
							type='button'
							onClick={() => onReact(emoji)}
							className={cn(
								'flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-sm transition-colors hover:bg-muted',
								reaction &&
									reaction.count > 0 &&
									'border-primary/40 bg-brand-muted'
							)}
						>
							<span>{emoji}</span>
							{reaction && reaction.count > 0 && (
								<span className='text-xs font-medium text-muted-foreground'>
									{reaction.count}
								</span>
							)}
						</button>
					)
				})}
			</div>
		</div>
	)
}
