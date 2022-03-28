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

export default function HooksPage() {
	const count = useCounter();
	console.log('CALLING - HOOKS');

	return (
		<>
			<div>Hooks - {count}</div>
			<SimpleComponent />
		</>
	);
}
