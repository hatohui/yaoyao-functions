import { Facebook, Twitter, Twitch } from 'lucide-react'

export function SocialSidebar() {
	return (
		<>
			{/* Desktop Fixed Sidebar */}
			<div className='fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 rounded-full border border-border/50 bg-background/80 p-2 shadow-sm backdrop-blur-md xl:flex'>
				<a
					href='https://www.facebook.com/chee.yao.963'
					target='_blank'
					rel='noopener noreferrer'
					className='flex size-10 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-[#1877F2] hover:text-white'
					title='YaoYao Facebook'
				>
					<Facebook className='size-5' />
				</a>
				<a
					href='https://x.com/Huskyaoo'
					target='_blank'
					rel='noopener noreferrer'
					className='flex size-10 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
					title='YaoYao Twitter'
				>
					<Twitter className='size-5' />
				</a>
				<a
					href='https://www.twitch.tv/Huskyao'
					target='_blank'
					rel='noopener noreferrer'
					className='flex size-10 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-[#9146FF] hover:text-white'
					title='YaoYao Twitch'
				>
					<Twitch className='size-5' />
				</a>
				<div className='mx-auto h-px w-6 bg-border/50 my-1' />
				<a
					href='https://www.facebook.com/AsterTheDragon'
					target='_blank'
					rel='noopener noreferrer'
					className='flex size-10 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-[#1877F2] hover:text-white'
					title='Aster Facebook'
				>
					<Facebook className='size-5' />
				</a>
				<a
					href='https://x.com/asterdragon_'
					target='_blank'
					rel='noopener noreferrer'
					className='flex size-10 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
					title='Aster Twitter'
				>
					<Twitter className='size-5' />
				</a>
			</div>

			{/* Mobile Bottom Bar */}
			<div className='flex flex-wrap items-center justify-center gap-3 pb-8 xl:hidden'>
				<a
					href='https://www.facebook.com/chee.yao.963'
					target='_blank'
					rel='noopener noreferrer'
					className='flex size-10 items-center justify-center rounded-full bg-accent/5 text-muted-foreground transition-all hover:bg-[#1877F2] hover:text-white'
				>
					<Facebook className='size-4' />
				</a>
				<a
					href='https://x.com/Huskyaoo'
					target='_blank'
					rel='noopener noreferrer'
					className='flex size-10 items-center justify-center rounded-full bg-accent/5 text-muted-foreground transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
				>
					<Twitter className='size-4' />
				</a>
				<a
					href='https://www.twitch.tv/Huskyao'
					target='_blank'
					rel='noopener noreferrer'
					className='flex size-10 items-center justify-center rounded-full bg-accent/5 text-muted-foreground transition-all hover:bg-[#9146FF] hover:text-white'
				>
					<Twitch className='size-4' />
				</a>
				<div className='h-4 w-px bg-border/50' />
				<a
					href='https://www.facebook.com/AsterTheDragon'
					target='_blank'
					rel='noopener noreferrer'
					className='flex size-10 items-center justify-center rounded-full bg-accent/5 text-muted-foreground transition-all hover:bg-[#1877F2] hover:text-white'
				>
					<Facebook className='size-4' />
				</a>
				<a
					href='https://x.com/asterdragon_'
					target='_blank'
					rel='noopener noreferrer'
					className='flex size-10 items-center justify-center rounded-full bg-accent/5 text-muted-foreground transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
				>
					<Twitter className='size-4' />
				</a>
			</div>
		</>
	)
}
