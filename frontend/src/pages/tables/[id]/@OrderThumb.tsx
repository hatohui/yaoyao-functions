import { useState } from 'react'
import { UtensilsCrossed } from 'lucide-react'

interface OrderThumbProps {
	src: string | null
	alt: string
}

export function OrderThumb({ src, alt }: OrderThumbProps) {
	const [imgError, setImgError] = useState(false)

	return (
		<div className='flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted'>
			{src && !imgError ? (
				<img
					src={src}
					alt={alt}
					className='h-full w-full object-cover'
					onError={() => setImgError(true)}
				/>
			) : (
				<UtensilsCrossed className='size-5 text-muted-foreground' />
			)}
		</div>
	)
}
