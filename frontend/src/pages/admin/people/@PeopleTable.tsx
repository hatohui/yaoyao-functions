import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { ColumnDef } from '@tanstack/react-table'
import type { PersonRowDto } from '@/api/model'
import { DataGrid } from '@/components/data-grid/data-grid'
import { getDataGridSelectColumn } from '@/components/data-grid/data-grid-select-column'
import { useDataGrid } from '@/hooks/use-data-grid'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { PersonNoteCell } from './@PersonNoteCell'

interface PeopleTableProps {
	people: PersonRowDto[]
	tableOptions: { label: string; value: string }[]
	isLoading: boolean
	onDataChange: (updated: PersonRowDto[]) => void
}

export function PeopleTable({
	people,
	tableOptions,
	isLoading,
	onDataChange,
}: PeopleTableProps) {
	const { t } = useTranslation()

	const columns = React.useMemo<ColumnDef<PersonRowDto>[]>(
		() => [
			getDataGridSelectColumn<PersonRowDto>({
				readOnly: true,
				enableRowMarkers: true,
			}),
			{
				id: 'name',
				accessorKey: 'name',
				header: t('admin.people.name'),
				size: 200,
				meta: {
					label: t('admin.people.name'),
					cell: { variant: 'short-text' },
				},
			},
			{
				id: 'tableId',
				accessorKey: 'tableId',
				header: t('admin.people.table'),
				size: 180,
				meta: {
					label: t('admin.people.table'),
					cell: { variant: 'select', options: tableOptions },
				},
			},
			{
				id: 'ordered',
				header: () => t('admin.people.ordered'),
				size: 110,
				enableSorting: false,
				cell: ({ row }) => {
					const person = row.original
					if (person.ordered.length === 0) {
						return <span className='text-muted-foreground'>—</span>
					}
					return person.tableId ? (
						<Link
							to={`/tables/${person.tableId}`}
							title={person.ordered.join(', ')}
							className='inline-flex rounded-full transition-opacity hover:opacity-80'
						>
							<Badge className='rounded-full'>{person.ordered.length}</Badge>
						</Link>
					) : (
						<Badge variant='outline' className='rounded-full'>
							{person.ordered.length}
						</Badge>
					)
				},
			},
			{
				id: 'note',
				header: () => t('admin.people.note'),
				size: 260,
				enableSorting: false,
				cell: ({ row }) => (
					<PersonNoteCell
						personId={row.original.id}
						note={row.original.note ?? null}
					/>
				),
			},
		],
		[t, tableOptions]
	)

	const { table, ...dataGridProps } = useDataGrid({
		data: people,
		columns,
		onDataChange,
		getRowId: row => row.id,
	})

	if (isLoading) {
		return (
			<div className='flex justify-center py-16'>
				<Spinner />
			</div>
		)
	}

	if (people.length === 0) {
		return (
			<p className='py-16 text-center text-sm text-muted-foreground'>
				{t('admin.people.empty')}
			</p>
		)
	}

	return (
		<DataGrid
			table={table}
			{...dataGridProps}
			onRowAdd={undefined}
			height={560}
			stretchColumns
		/>
	)
}
