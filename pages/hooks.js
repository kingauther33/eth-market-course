import { fetchSteamGames, fetchDetailGame } from '@utils/fetchSteamGames';
import { useState, useEffect } from 'react';

const useCounter = () => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		setInterval(() => {
			setCount((c) => c + 1);
		}, 1000);
	}, []);

	return count;
};

const SimpleComponent = () => {
	console.log('CALLING - SIMPLE');
	return <h1>Simple Component</h1>;
};

export default function HooksPage({ data }) {
	// const count = useCounter();
	console.log('CALLING - HOOKS');
	console.log(data);

	return (
		<>
			{/* <div>Hooks - {count}</div> */}
			<SimpleComponent />
		</>
	);
}

export async function getStaticProps() {
	const data = await fetchSteamGames();
	// const data = await fetchDetailGame(1855390);
	// Retrieving assets from OPENSEA API
	if (!data) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			data,
		}, // will be passed to the page component as props
	};
}
