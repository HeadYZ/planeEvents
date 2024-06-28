import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'

import Header from '../Header.jsx'
import { useMutation, useQuery } from '@tanstack/react-query'
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js'
import ErrorBlock from '../UI/ErrorBlock.jsx'
import LoadingIndicator from '../UI/LoadingIndicator.jsx'

export default function EventDetails() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { data, isPending, isError, error } = useQuery({
		queryKey: ['events', id],
		queryFn: ({ signal }) => {
			return fetchEvent({ id, signal })
		},
	})

	const { mutate } = useMutation({
		mutationFn: deleteEvent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'], refetchType: 'none' })
			navigate('../')
		},
	})
	const deleteEventHandler = () => {
		mutate({ id })
	}
	return (
		<>
			<Outlet />
			<Header>
				<Link to='/events' className='nav-item'>
					View all Events
				</Link>
			</Header>
			<article id='event-details'>
				{isPending && (
					<div id='event-details-content' className='center'>
						<LoadingIndicator />
					</div>
				)}
				{isError && (
					<div id='event-details-content' className='center'>
						<LoadingIndicator />
						<ErrorBlock
							title='Failed to load event'
							message={error.info?.message || 'Failed to fetch event data, please try again later.'}
						/>
					</div>
				)}
				{data && (
					<>
						<header>
							<h1>{data.title}</h1>
							<nav>
								<button onClick={deleteEventHandler}>Delete</button>
								<Link to='edit'>Edit</Link>
							</nav>
						</header>
						<div id='event-details-content'>
							<img src={`http://localhost:3000/${data.image}`} alt={data.title} />
							<div id='event-details-info'>
								<div>
									<p id='event-details-location'>{data.location}</p>
									<time dateTime={`Todo-Date$Todo-Time`}>
										{data.date} & {data.time}
									</time>
								</div>
								<p id='event-details-description'>{data.description}</p>
							</div>
						</div>
					</>
				)}
			</article>
		</>
	)
}
