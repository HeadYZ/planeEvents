import { Link, useNavigate, useParams } from 'react-router-dom'

import Modal from '../UI/Modal.jsx'
import EventForm from './EventForm.jsx'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchEvent, updateEvent } from '../../util/http.js'
import ErrorBlock from '../UI/ErrorBlock.jsx'
import LoadingIndicator from '../UI/LoadingIndicator.jsx'

export default function EditEvent() {
	const navigate = useNavigate()
	const { id } = useParams()

	const { mutate } = useMutation({ mutationFn: updateEvent })

	function handleSubmit(formData) {
		mutate({ id, event: formData })
		navigate('../')
	}

	function handleClose() {
		navigate('../')
	}

	const { data, isPending, isError, error } = useQuery({
		queryKey: ['events', id],
		queryFn: ({ signal }) => fetchEvent({ signal, id }),
	})

	return (
		<Modal onClose={handleClose}>
			{isPending && (
				<div className='center'>
					<LoadingIndicator />
				</div>
			)}
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
