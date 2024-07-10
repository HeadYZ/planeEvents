import { useIsFetching } from '@tanstack/react-query'

export default function Header({ children }) {
	const fetching = useIsFetching()

	return (
		<>
			{fetching > 0 && <progress />}
			<div id='main-header-loading'></div>
			<header id='main-header'>
				<div id='header-title'>
					<h1>React Events</h1>
				</div>
				<nav>{children}</nav>
			</header>
		</>
	)
}
