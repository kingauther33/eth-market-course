import fetch from 'node-fetch';

const options = { method: 'GET' };

fetch(
	'https://api.opensea.io/api/v1/asset_contract/0x06012c8cf97bead5deae237070f9587f8e7a266d',
	options
)
	.then((response) => response.json())
	.then((response) => console.log(response))
	.catch((err) => console.error(err));

export const fetchData = async (url, options) => {
	const response = await fetch(url, {
		headers: { Accept: 'application/json' },
		...options,
	});

	const data = await response.json();
	return data;
};
