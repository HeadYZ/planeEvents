import { Link, useNavigate, useParams } from 'react-router-dom'

import Modal from '../UI/Modal.jsx'
import EventForm from './EventForm.jsx'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchEvent, queryClient, updateEvent } from '../../util/http.js'
import ErrorBlock from '../UI/ErrorBlock.jsx'

export default function EditEvent() {
	const navigate = useNavigate()
	const { id } = useParams()

	const { data, isError, error } = useQuery({
		queryKey: ['events', id],
		queryFn: ({ signal }) => fetchEvent({ signal, id }),
	})
	const { mutate } = useMutation({
		mutationFn: updateEvent,
		onMutate: async data => {
			const newEvent = data.event
			await queryClient.cancelQueries({ queryKey: ['events'], id })
			const previousEvent = queryClient.getQueryData(['events', id])
			queryClient.setQueryData(['events', id], newEvent)
			return { previousEvent }
		},
		onError: (error, data, context) => {
			queryClient.setQueryData(['events', id], context.previousEvent)
		},
		onSettled: () => {
			queryClient.invalidateQueries(['events', id])
		},
	})

	function handleSubmit(formData) {
		mutate({ id, event: formData })
		navigate('../')
	}

	function handleClose() {
		navigate('../')
	}

	return (
		<Modal onClose={handleClose}>
			{isError && (
				<>
					<ErrorBlock
						title='Failed to load event'
						message={error.info?.message || 'Failed to load event. Please check your inputs and try again later.'}
					/>
					<div className='form-actions'>
						<Link to='../' className='button'>
							Okay
						</Link>
					</div>
				</>
			)}
			{data && (
				<EventForm inputData={data} onSubmit={handleSubmit}>
					<Link to='../' className='button-text'>
						Cancel
					</Link>
					<button type='submit' className='button'>
						Update
					</button>
				</EventForm>
			)}
		</Modal>
	)
}

export function loader({ params }) {
	return queryClient.fetchQuery({
		queryKey: ['events', params.id],
		queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
	})
}
