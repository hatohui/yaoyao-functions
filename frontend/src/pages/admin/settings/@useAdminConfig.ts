import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import {
	useGetConfig,
	useUpdateConfig,
	getGetConfigQueryKey,
	getGetPublicConfigQueryKey,
} from '@/api/config/config'
import { useToast } from '@/hooks/useToast'
import type { AppConfigDto } from '@/api/model'

export function useAdminConfig() {
	const { t } = useTranslation()
	const toast = useToast()
	const qc = useQueryClient()
	const listKey = getGetConfigQueryKey()

	const { data, isLoading } = useGetConfig<AppConfigDto[]>()

	const groups = useMemo(() => {
		const map = new Map<string, AppConfigDto[]>()
		for (const row of data ?? []) {
			const key = row.category ?? 'other'
			const list = map.get(key) ?? []
			list.push(row)
			map.set(key, list)
		}
		return [...map.entries()]
	}, [data])

	const { mutate } = useUpdateConfig({
		mutation: {
			onMutate: async ({ key, data: body }) => {
				await qc.cancelQueries({ queryKey: listKey })
				const prev = qc.getQueryData<AppConfigDto[]>(listKey)
				qc.setQueryData<AppConfigDto[]>(listKey, old =>
					(old ?? []).map(r =>
						r.key === key ? { ...r, value: body.value } : r
					)
				)
				return { prev }
			},
			onError: (_e, _v, ctx) => {
				qc.setQueryData(listKey, ctx?.prev)
				toast.error(t('admin.settings.save_failed'))
			},
			onSettled: () => {
				qc.invalidateQueries({ queryKey: listKey })
				qc.invalidateQueries({ queryKey: getGetPublicConfigQueryKey() })
			},
		},
	})

	const save = (key: string, value: string) => mutate({ key, data: { value } })

	return { groups, isLoading, save }
}
