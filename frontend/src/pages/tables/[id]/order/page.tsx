import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowLeft, ShoppingCart, UserPlus } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { PaginationBar } from '@/components/common/PaginationBar'
import { FilterBar } from '@/pages/menu/@FilterBar'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { ProductCard } from './@ProductCard'
import { CartPanel } from './@CartPanel'
import { useTableOrdering } from './@useTableOrdering'
import { useOrderCart } from './@useOrderCart'

export default function TableOrderPage() {
	const { t } = useTranslation()
	const {
		tableId,
		table,
		search,
		setSearch,
		category,
		setCategory,
		sort,
		setSort,
		popular,
		setPopular,
		categories,
		foods,
		isLoading,
		isError,
		pagination,
	} = useTableOrdering()
	const cart = useOrderCart(tableId)
	const tableIsEmpty = (table?.seated ?? 0) === 0

	const cartPanel = (
		<CartPanel
			lines={cart.lines}
			people={cart.people}
			myPersonId={cart.myPersonId}
			total={cart.total}
			currency={cart.currency}
			itemCount={cart.itemCount}
			isPlacing={cart.isPlacing}
			onQuantityChange={cart.setQuantity}
			onModeChange={cart.setMode}
			onTogglePerson={cart.togglePerson}
			onRemove={cart.remove}
			onClear={cart.clear}
			onCheckout={cart.checkout}
		/>
	)

	return (
		<div className='mx-auto max-w-6xl px-4 py-6'>
			<Link
				to={`/tables/${tableId}`}
				className='mb-3 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
			>
				<ArrowLeft className='size-4' />
				{table?.name ?? t('tables.all_tables')}
			</Link>

			{tableIsEmpty ? (
				<div className='flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 px-6 py-16 text-center'>
					<UserPlus className='size-8 text-muted-foreground' />
					<p className='text-sm font-medium text-foreground'>
						{t('orders.needs_people_title')}
					</p>
					<p className='max-w-sm text-sm text-muted-foreground'>
						{t('orders.needs_people_body')}
					</p>
					<Button asChild className='mt-1 gap-1.5 rounded-full'>
						<Link to={`/tables/${tableId}`}>
							<UserPlus className='size-4' />
							{t('orders.seat_someone')}
						</Link>
					</Button>
				</div>
			) : (
				<div className='flex gap-6'>
					<div className='flex min-w-0 flex-1 flex-col gap-4'>
						<h1 className='text-xl font-bold text-foreground'>
							{t('orders.add_order')}
						</h1>

						<div className='-mx-4 px-4 sm:mx-0 sm:px-0'>
							<FilterBar
								search={search}
								onSearchChange={setSearch}
								count={pagination.count}
								onCountChange={pagination.setCount}
								activeCategory={category}
								onCategoryChange={setCategory}
								categories={categories}
								sort={sort}
								onSortChange={setSort}
								popular={popular}
								onPopularChange={setPopular}
							/>
						</div>

						{isLoading ? (
							<div className='flex justify-center py-16'>
								<Spinner />
							</div>
						) : isError ? (
							<p className='py-16 text-center text-sm text-muted-foreground'>
								{t('tables.load_error')}
							</p>
						) : foods.length === 0 ? (
							<p className='py-16 text-center text-sm text-muted-foreground'>
								{t('menu.no_results')}
							</p>
						) : (
							<>
								<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
									{foods.map(food => (
										<ProductCard
											key={food.id}
											food={food}
											quantity={cart.quantityOf(food.id)}
											onAdd={() => cart.add(food)}
											onQuantityChange={q => cart.setQuantity(food.id, q)}
										/>
									))}
								</div>
								<div className='flex justify-center'>
									<PaginationBar pagination={pagination} />
								</div>
							</>
						)}
					</div>

					<aside className='hidden w-80 shrink-0 lg:block'>
						<div className='sticky top-20 rounded-2xl border border-border/60 bg-card p-4 shadow-sm'>
							{cartPanel}
						</div>
					</aside>
				</div>
			)}

			{!tableIsEmpty && cart.itemCount > 0 && (
				<Sheet>
					<SheetTrigger asChild>
						<Button className='fixed inset-x-4 bottom-4 z-30 mx-auto flex w-fit gap-2 rounded-full shadow-lg lg:hidden'>
							<ShoppingCart className='size-4' />
							{t('orders.view_cart', { count: cart.itemCount })}
							<span className='font-semibold'>
								{cart.total.toFixed(2)} {cart.currency}
							</span>
						</Button>
					</SheetTrigger>
					<SheetContent
						side='bottom'
						className='max-h-[85vh] overflow-y-auto rounded-t-3xl'
					>
						<SheetHeader>
							<SheetTitle>{t('orders.cart')}</SheetTitle>
						</SheetHeader>
						<div className='px-4 pb-6'>{cartPanel}</div>
					</SheetContent>
				</Sheet>
			)}
		</div>
	)
}
