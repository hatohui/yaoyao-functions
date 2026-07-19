import { useEffect, useState } from 'react'
import { useGetActiveEvent, useGetPastEvents } from '@/api/events/events'
import { useGetFeedbackByEvent } from '@/api/feedback/feedback'
import type {
	EventSummaryDto,
	GetFeedbackResponseDto,
	GetFeedbackByEventSort,
} from '@/api/model'
import { usePagination } from '@/hooks/usePagination'

export function useAdminFeedback() {
	const { data: activeEvent } = useGetActiveEvent<EventSummaryDto | null>()
	const { data: pastEvents = [] } = useGetPastEvents<EventSummaryDto[]>()

	const [eventId, setEventId] = useState<string | null>(null)
	const [sort, setSort] = useState<GetFeedbackByEventSort>('recent')
	const [total, setTotal] = useState(0)
	const pagination = usePagination({ total, initialCount: 20 })

	useEffect(() => {
		if (!eventId && activeEvent) setEventId(activeEvent.id)
	}, [eventId, activeEvent])

	const events = [...(activeEvent ? [activeEvent] : []), ...pastEvents]

	const { data, isLoading } = useGetFeedbackByEvent<GetFeedbackResponseDto>(
		{
			eventId: eventId ?? '',
			page: pagination.page,
			count: pagination.count,
			sort,
		},
		{ query: { enabled: Boolean(eventId) } }
	)

	useEffect(() => {
		if (data?.total !== undefined) setTotal(data.total)
	}, [data?.total])

	return {
		events,
		eventId,
		setEventId,
		sort,
		setSort,
		pagination,
		feedback: data?.feedback ?? [],
		isLoading,
	}
}
