import { useTranslation } from 'react-i18next'
import { Spinner } from '@/components/ui/spinner'
import { SearchBar } from '@/components/common/SearchBar'
import { PaginationBar } from '@/components/common/PaginationBar'
import { TableList } from './@TableList'
import { useTableSearch } from './@useTableSearch'

export default function TablesPage() {
	const { t } = useTranslation()
	const { search, setSearch, tables, isLoading, isError, pagination } = useTableSearch()

	return (
		<div className='mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6'>
			<h1 className='text-xl font-bold text-foreground'>{t('tables.find_title')}</h1>

			<SearchBar
				value={search}
				onChange={setSearch}
				placeholder={t('tables.search_placeholder')}
			/>

			<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
				{t('tables.all_tables')}
			</p>

			{isLoading ? (
				<div className='flex justify-center py-16'>
					<Spinner />
				</div>
			) : isError ? (
				<p className='py-16 text-center text-sm text-muted-foreground'>{t('tables.load_error')}</p>
			) : tables.length === 0 ? (
				<p className='py-16 text-center text-sm text-muted-foreground'>{t('tables.none_found')}</p>
			) : (
				<>
					<TableList tables={tables} />
					<div className='mt-2 flex justify-center'>
						<PaginationBar pagination={pagination} />
					</div>
				</>
			)}
		</div>
	)
}
