import { useTranslation } from 'react-i18next'
import { SearchBar } from '@/components/common/SearchBar'
import { PaginationBar } from '@/components/common/PaginationBar'
import { usePeopleList } from './@usePeopleList'
import { PeopleTable } from './@PeopleTable'

export default function AdminPeoplePage() {
	const { t } = useTranslation()
	const {
		search,
		setSearch,
		pagination,
		people,
		tableOptions,
		onDataChange,
		isLoading,
		isError,
	} = usePeopleList()

	return (
		<div className='flex flex-col gap-4'>
			<h1 className='text-xl font-bold text-foreground'>
				{t('admin.people.title')}
			</h1>

			<SearchBar
				value={search}
				onChange={setSearch}
				placeholder={t('admin.people.search_placeholder')}
			/>

			{isError ? (
				<p className='py-16 text-center text-sm text-muted-foreground'>
					{t('tables.load_error')}
				</p>
			) : (
				<PeopleTable
					people={people}
					tableOptions={tableOptions}
					isLoading={isLoading}
					onDataChange={onDataChange}
				/>
			)}

			<div className='flex justify-center'>
				<PaginationBar pagination={pagination} />
			</div>
		</div>
	)
}
