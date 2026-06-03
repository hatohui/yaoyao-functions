import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetFoods } from '@/api/foods/foods'
import { useGetCategories } from '@/api/categories/categories'
import { usePagination } from '@/hooks/usePagination'
import { useMenuSearchParams } from '@/utils/searchParams'
import { HeroSection } from './@HeroSection'
import { FilterBar } from './@FilterBar'
import { FoodCard } from './@FoodCard'
import { LoadingView, LoadingSpinner } from './@LoadingView'
import { ErrorView } from './@ErrorView'
import { EmptyView } from './@EmptyView'
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
import type { FoodItemDto, CategoryItemDto, GetFoodsResponseDto } from '@/api/model'

export default function MenuPage() {
	const { t, i18n } = useTranslation()
	const [search, setSearch] = useState('')
	const [total, setTotal] = useState(0)

	const {
		page: urlPage,
		count: urlCount,
		category,
		setPage: setUrlPage,
		setCount: setUrlCount,
		setCategory,
		resetParams,
	} = useMenuSearchParams()

	const {
		page,
		count,
		setCount,
		getPageNumbers,
		handlePageChange,
		goToNextPage,
		goToPreviousPage,
		canGoNext,
		canGoPrevious,
		totalPages,
	} = usePagination({
		initialPage: urlPage,
		initialCount: urlCount,
		total,
		onPageChange: setUrlPage,
		onCountChange: setUrlCount,
	})

	const { data, isLoading, isError, error, refetch } = useGetFoods<GetFoodsResponseDto>({
		lang: i18n.language,
		page,
		count,
		category: category === 'all' ? undefined : category,
	})

	useEffect(() => {
		if (data?.total !== undefined) setTotal(data.total)
	}, [data?.total])

	const { data: categoriesRaw } = useGetCategories<CategoryItemDto[]>({
		lang: i18n.language,
	})

	const categories = useMemo<CategoryItemDto[]>(
		() => (Array.isArray(categoriesRaw) ? categoriesRaw : []),
		[categoriesRaw]
	)

	const filteredFoods = useMemo(() => {
		if (!data?.foods) return []
		if (!search.trim()) return data.foods
		const q = search.toLowerCase()
		return data.foods.filter(
			(f: FoodItemDto) =>
				f.name.toLowerCase().includes(q) ||
				f.description?.toLowerCase().includes(q)
		)
	}, [data?.foods, search])

	const hasFilters = category !== 'all' || search.trim() !== ''

	const handleReset = () => {
		resetParams()
		setSearch('')
	}

	return (
		<div className='min-h-screen bg-background'>
			<HeroSection totalCount={data?.total} />

			<div className='mx-auto max-w-6xl px-4'>
				<FilterBar
					search={search}
					onSearchChange={setSearch}
					count={count}
					onCountChange={setCount}
					activeCategory={category}
					onCategoryChange={setCategory}
					categories={categories}
				/>

				<div className='py-8'>
					{isLoading && !data ? (
						<LoadingView />
					) : isError && error ? (
						<ErrorView error={error as Error} onRetry={() => refetch()} />
					) : isLoading ? (
						<LoadingSpinner />
					) : filteredFoods.length === 0 ? (
						<EmptyView hasFilters={hasFilters} onReset={handleReset} />
					) : (
						<>
							<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
								{filteredFoods.map((food: FoodItemDto) => (
									<FoodCard key={food.id} food={food} />
								))}
							</div>

							{totalPages > 1 && (
								<div className='mt-10 flex flex-col items-center gap-3'>
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
																	? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
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

									<p className='text-xs text-muted-foreground'>
										{t('menu.showing', {
											from: (page - 1) * count + 1,
											to: Math.min(page * count, data!.total),
											total: data!.total,
										})}
									</p>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	)
}
