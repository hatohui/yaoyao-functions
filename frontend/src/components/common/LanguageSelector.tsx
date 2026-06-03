import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/config/i18n'
import { Globe } from 'lucide-react'

const languages = [
	{ code: 'en', name: 'English' },
	{ code: 'vi', name: 'Tiếng Việt' },
	{ code: 'th', name: 'ไทย' },
	{ code: 'zh', name: '中文' },
]

export const LanguageSelector = () => {
	const { lang, setLanguage } = useLanguage()

	return (
		<Select value={lang} onValueChange={setLanguage}>
			<SelectTrigger className='h-8 w-auto gap-1 border-none bg-transparent px-2 shadow-none transition-colors hover:bg-accent focus:ring-0'>
				<Globe className='size-3.5 shrink-0 text-muted-foreground' />
				<span className='hidden sm:contents'>
					<SelectValue />
				</span>
				<span className='contents sm:hidden text-xs font-semibold uppercase'>
					{lang}
				</span>
			</SelectTrigger>
			<SelectContent align='end'>
				{languages.map(l => (
					<SelectItem key={l.code} value={l.code}>
						{l.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
