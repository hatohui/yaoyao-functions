import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import type { FoodDetailDto, CategoryItemDto } from '@/api/model'
import { DataGrid } from '@/components/data-grid/data-grid'
import { getDataGridSelectColumn } from '@/components/data-grid/data-grid-select-column'
import { useDataGrid } from '@/hooks/use-data-grid'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface FoodTableProps {
	foods: FoodDetailDto[]
	categories: CategoryItemDto[]
	isLoading: boolean
	onDataChange: (updated: FoodDetailDto[]) => void
	onDelete: (id: string) => void
	onBulkToggle: (ids: string[], isAvailable: boolean) => void
	onBulkDelete: (ids: string[]) => void
	onAddVariant: (foodId: string, label: string, price: number) => void
}

export function FoodTable({
	foods,
	categories,
	isLoading,
	onDataChange,
	onDelete,
	onBulkToggle,
	onBulkDelete,
}: FoodTableProps) {
	const { t } = useTranslation()

	const categoryOptions = React.useMemo(
		() =>
			categories.map(c => ({ label: c.name, value: c.id })),
		[categories]
	)

	const columns = React.useMemo<ColumnDef<FoodDetailDto>[]>(
		() => [
			getDataGridSelectColumn<FoodDetailDto>(),
			{
				id: 'name',
				accessorKey: 'name',
				header: t('admin.food.name'),
				size: 220,
				meta: { label: t('admin.food.name'), cell: { variant: 'short-text' } },
			},
			{
				id: 'categoryId',
				accessorKey: 'categoryId',
				header: t('admin.food.category'),
				size: 160,
				meta: {
					label: t('admin.food.category'),
					cell: {
						variant: 'select',
						options: categoryOptions,
					},
				},
			},
			{
				id: 'isAvailable',
				accessorKey: 'isAvailable',
				header: t('admin.food.available'),
				size: 110,
				meta: { label: t('admin.food.available'), cell: { variant: 'checkbox' } },
			},
			{
				id: 'shouldCalculate',
				accessorKey: 'shouldCalculate',
				header: t('admin.food.calculated'),
				size: 150,
				meta: {
					label: t('admin.food.calculated'),
					cell: { variant: 'checkbox' },
				},
			},
		],
		[t, categoryOptions]
	)

	const onRowsDelete = React.useCallback(
		(rows: FoodDetailDto[]) => {
			const ids = rows.map(r => r.id)
			if (ids.length === 1) {
				onDelete(ids[0])
			} else {
				onBulkDelete(ids)
			}
		},
		[onDelete, onBulkDelete]
	)

	const { table, ...dataGridProps } = useDataGrid({
		data: foods,
		columns,
		onDataChange,
		onRowsDelete,
		getRowId: row => row.id,
	})

	const selected = table.getSelectedRowModel().rows
	const selectedIds = selected.map(r => r.original.id)

	if (isLoading) {
		return (
			<div className='flex justify-center py-16'>
				<Spinner />
			</div>
		)
	}

	if (foods.length === 0) {
		return (
			<p className='py-16 text-center text-sm text-muted-foreground'>
				{t('admin.food.empty')}
			</p>
		)
	}

	return (
		<div className='flex flex-col gap-3'>
			{selectedIds.length > 0 && (
				<div className='flex flex-wrap items-center gap-2'>
					<span className='text-sm font-medium text-foreground'>
						{t('admin.tables.selected_count', { count: selectedIds.length })}
					</span>
					<Button
						size='sm'
						variant='outline'
						className='rounded-full'
						onClick={() => {
							onBulkToggle(selectedIds, true)
							table.resetRowSelection()
						}}
					>
						{t('admin.food.bulk_enable')}
					</Button>
					<Button
						size='sm'
						variant='outline'
						className='rounded-full'
						onClick={() => {
							onBulkToggle(selectedIds, false)
							table.resetRowSelection()
						}}
					>
						{t('admin.food.bulk_disable')}
					</Button>
				</div>
			)}

			<DataGrid
				table={table}
				{...dataGridProps}
				height={520}
				stretchColumns
			/>
		</div>
	)
}
