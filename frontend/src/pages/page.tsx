import React from 'react'
import { ASSET_URL } from '@/common/app'
import VideoPlayer from '@/components/common/VideoPlayer'

const LandingPage = (): React.JSX.Element => {
	return (
		<div>
			<div className='fixed inset-0 z-0 h-screen w-screen'>
				<VideoPlayer
					className='absolute inset-0'
					src={`${ASSET_URL}/banner.mp4`}
					muted
					autoPlay
					loop
					playsInline
				/>
				<div className='absolute inset-0 bg-black/40 dark:bg-black/60' />
			</div>
		</div>
	)
}

export default LandingPage
