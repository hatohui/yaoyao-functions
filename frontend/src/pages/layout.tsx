import React from 'react'
import { Navbar } from '@/components/common/Navbar'

const MainLayout = ({ children }: { children: React.ReactNode }): React.ReactElement => {
	return (
		<div>
			<Navbar />
			<main className='pt-14'>{children}</main>
		</div>
	)
}

export default MainLayout
