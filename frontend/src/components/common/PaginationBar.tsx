import type { usePagination } from '@/hooks/usePagination'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	PaginationEllipsis,
} from '@/components/ui/pagination'
import { cn } from '@/utils/shadcn'

interface PaginationBarProps {
	pagination: ReturnType<typeof usePagination>
}

export function PaginationBar({ pagination }: PaginationBarProps) {
	const {
		page,
		getPageNumbers,
		handlePageChange,
		goToNextPage,
		goToPreviousPage,
		canGoNext,
		canGoPrevious,
		totalPages,
	} = pagination

	if (totalPages <= 1) return null

	return (
		<Pagination>
			<PaginationContent className='flex-wrap gap-1'>
				<PaginationItem>
					<PaginationPrevious
						onClick={goToPreviousPage}
						aria-disabled={!canGoPrevious}
						className={cn(
							'cursor-pointer rounded-full bg-muted/60 transition-colors hover:bg-muted',
							!canGoPrevious && 'pointer-events-none opacity-40'
						)}
					/>
				</PaginationItem>

				{getPageNumbers().map((pageNum, idx) =>
					pageNum === 'ellipsis' ? (
						<PaginationItem key={`ellipsis-${idx}`}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={pageNum}>
							<PaginationLink
								onClick={() => handlePageChange(pageNum)}
								isActive={page === pageNum}
								className={cn(
									'cursor-pointer rounded-full transition-colors',
									page === pageNum
										? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
										: 'bg-muted/60 hover:bg-muted'
								)}
							>
								{pageNum}
							</PaginationLink>
						</PaginationItem>
					)
				)}

				<PaginationItem>
					<PaginationNext
						onClick={goToNextPage}
						aria-disabled={!canGoNext}
						className={cn(
							'cursor-pointer rounded-full bg-muted/60 transition-colors hover:bg-muted',
							!canGoNext && 'pointer-events-none opacity-40'
						)}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}
