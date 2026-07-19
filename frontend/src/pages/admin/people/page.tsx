import { useTranslation } from 'react-i18next'
import { SearchBar } from '@/components/common/SearchBar'
import { PaginationBar } from '@/components/common/PaginationBar'
import { Spinner } from '@/components/ui/spinner'
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { usePeopleList } from './@usePeopleList'

export default function AdminPeoplePage() {
	const { t } = useTranslation()
	const { search, setSearch, pagination, people, isLoading, isError } =
		usePeopleList()

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

			{isLoading ? (
				<div className='flex justify-center py-16'>
					<Spinner />
				</div>
			) : isError ? (
				<p className='py-16 text-center text-sm text-muted-foreground'>
					{t('tables.load_error')}
				</p>
			) : people.length === 0 ? (
				<p className='py-16 text-center text-sm text-muted-foreground'>
					{t('admin.people.empty')}
				</p>
			) : (
				<div className='overflow-hidden rounded-2xl border border-border/60 bg-card'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('admin.people.name')}</TableHead>
								<TableHead>{t('admin.people.table')}</TableHead>
								<TableHead>{t('admin.people.ordered')}</TableHead>
								<TableHead>{t('admin.people.note')}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{people.map(person => (
								<TableRow key={person.id}>
									<TableCell className='font-medium text-foreground'>
										{person.name}
									</TableCell>
									<TableCell className='text-muted-foreground'>
										{person.tableName ?? '—'}
									</TableCell>
									<TableCell className='whitespace-normal'>
										{person.ordered.length === 0 ? (
											<span className='text-muted-foreground'>—</span>
										) : (
											<div className='flex flex-wrap gap-1'>
												{person.ordered.map(item => (
													<Badge
														key={item}
														variant='outline'
														className='rounded-full font-normal'
													>
														{item}
													</Badge>
												))}
											</div>
										)}
									</TableCell>
									<TableCell className='max-w-xs whitespace-normal text-muted-foreground'>
										{person.note ?? '—'}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			<div className='flex justify-center'>
				<PaginationBar pagination={pagination} />
			</div>
		</div>
	)
}
