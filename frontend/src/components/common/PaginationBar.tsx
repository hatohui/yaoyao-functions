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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useTranslation } from 'react-i18next'
import { MENU_PAGE_SIZE_ALL, MENU_PAGE_SIZE_OPTIONS } from '@/common/constants'
import { cn } from '@/utils/shadcn'

interface PaginationBarProps {
	pagination: ReturnType<typeof usePagination>
	showPageSize?: boolean
}

export function PaginationBar({
	pagination,
	showPageSize,
}: PaginationBarProps) {
	const { t } = useTranslation()
	const {
		page,
		getPageNumbers,
		handlePageChange,
		goToNextPage,
		goToPreviousPage,
		canGoNext,
		canGoPrevious,
		totalPages,
		count,
		setCount,
	} = pagination

	if (totalPages <= 1 && !showPageSize) return null

	return (
		<div className='flex flex-wrap items-center justify-center gap-4'>
			{totalPages > 1 && (
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
								<PaginationItem
									key={`ellipsis-${idx}`}
									className='hidden sm:block'
								>
									<PaginationEllipsis />
								</PaginationItem>
							) : (
								<PaginationItem
									key={pageNum}
									className={cn(page !== pageNum && 'hidden sm:block')}
								>
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
			)}

			{showPageSize && (
				<div className='flex items-center gap-2'>
					<Select
						value={count.toString()}
						onValueChange={val => setCount(Number(val))}
					>
						<SelectContent>
							{MENU_PAGE_SIZE_OPTIONS.map(n => (
								<SelectItem key={n} value={n.toString()}>
									{n}
								</SelectItem>
							))}
							<SelectItem value={MENU_PAGE_SIZE_ALL.toString()}>
								{t('menu.count_all')}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			)}
		</div>
	)
}
