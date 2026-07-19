import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'
import type { TableDto } from '@/api/model'
import { cn } from '@/utils/shadcn'

interface AdminFloorPlanCanvasProps {
	tables: TableDto[]
	onDrag: (id: string, x: number, y: number) => void
	onDrop: (id: string, x: number, y: number) => void
}

const clamp = (value: number) => Math.min(100, Math.max(0, value))

export function AdminFloorPlanCanvas({
	tables,
	onDrag,
	onDrop,
}: AdminFloorPlanCanvasProps) {
	const { t } = useTranslation()
	const containerRef = useRef<HTMLDivElement>(null)
	const [draggingId, setDraggingId] = useState<string | null>(null)

	const positionFromPointer = (clientX: number, clientY: number) => {
		const rect = containerRef.current?.getBoundingClientRect()
		if (!rect) return null
		return {
			x: clamp(((clientX - rect.left) / rect.width) * 100),
			y: clamp(((clientY - rect.top) / rect.height) * 100),
		}
	}

	const handlePointerMove = (e: React.PointerEvent) => {
		if (!draggingId) return
		const pos = positionFromPointer(e.clientX, e.clientY)
		if (pos) onDrag(draggingId, pos.x, pos.y)
	}

	const handlePointerUp = (e: React.PointerEvent) => {
		if (!draggingId) return
		const pos = positionFromPointer(e.clientX, e.clientY)
		if (pos) onDrop(draggingId, pos.x, pos.y)
		setDraggingId(null)
	}

	return (
		<div
			ref={containerRef}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerLeave={handlePointerUp}
			className='relative aspect-square w-full touch-none overflow-hidden rounded-2xl border border-border/60 bg-muted'
		>
			{tables.map(table => (
				<button
					key={table.id}
					type='button'
					onPointerDown={e => {
						e.currentTarget.setPointerCapture(e.pointerId)
						setDraggingId(table.id)
					}}
					style={{ left: `${table.x}%`, top: `${table.y}%` }}
					className={cn(
						'absolute flex -translate-x-1/2 -translate-y-1/2 cursor-grab flex-col items-center gap-0.5 rounded-2xl border bg-card px-3 py-2 text-xs font-medium shadow-sm transition-transform active:cursor-grabbing',
						draggingId === table.id
							? 'z-10 scale-110 border-primary shadow-lg'
							: 'border-border/60'
					)}
				>
					<span className='text-foreground'>{table.name}</span>
					<span className='flex items-center gap-1 text-muted-foreground'>
						<Users className='size-3' />
						{table.seated}/{table.capacity}
					</span>
				</button>
			))}

			{tables.length === 0 && (
				<p className='absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground'>
					{t('floor_plan.empty')}
				</p>
			)}
		</div>
	)
}
