import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useGetTableById } from '@/api/tables/tables'
import { useToast } from '@/hooks/useToast'
import type { TableDto } from '@/api/model'

export function useTableDetail() {
	const { id = '' } = useParams()
	const { t } = useTranslation()
	const toast = useToast()

	const { data: table, isLoading, isError } = useGetTableById<TableDto>(id)

	const shareLink = () => {
		navigator.clipboard?.writeText(window.location.href)
		toast.success(t('roster.link_copied'))
	}

	return { id, table, isLoading, isError, shareLink }
}
