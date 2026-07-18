import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useGuest } from '@/hooks/useGuest'

interface FeedbackFormProps {
	onPost: (by: string, content: string) => void
	isPosting: boolean
}

export function FeedbackForm({ onPost, isPosting }: FeedbackFormProps) {
	const { t } = useTranslation()
	const guestName = useGuest(s => s.name)
	const [by, setBy] = useState(guestName ?? '')
	const [content, setContent] = useState('')

	const submit = () => {
		if (!content.trim()) return
		onPost(by, content)
		setContent('')
	}

	return (
		<div className='flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-4 shadow-sm'>
			<Input
				value={by}
				onChange={e => setBy(e.target.value)}
				placeholder={t('feedback.name_placeholder')}
				className='rounded-full'
			/>
			<textarea
				value={content}
				onChange={e => setContent(e.target.value)}
				placeholder={t('feedback.content_placeholder')}
				rows={3}
				className='rounded-2xl border border-border/60 bg-transparent px-4 py-3 text-sm text-foreground outline-none focus:border-primary'
			/>
			<Button
				className='w-fit gap-1.5 self-end rounded-full'
				disabled={!content.trim() || isPosting}
				onClick={submit}
			>
				<Send className='size-4' />
				{t('feedback.post')}
			</Button>
		</div>
	)
}
