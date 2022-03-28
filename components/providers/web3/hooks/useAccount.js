import { useState, useEffect } from 'react';
import useSWR from 'swr';

const adminAddresses = {
	'0x0390aab3a0cd9714f74d3e741b9df7bdead5cd4930fe5e462f02eb8ad7b2835c': true,
	'0x573bfa1bad2a741d621809bb1170ed045626ba2628876890fbbb8eb31ac2e27c': true,
};

export const handler = (web3, provider) => () => {
	const { data, mutate, ...rest } = useSWR(
		web3 ? 'web3/accounts' : null,
		async () => {
			const accounts = await web3.eth.getAccounts();
			const account = accounts[0];

			if (!account) {
				throw new Error(
					'Cannot retreive an account. Please refresh the browser.'
				);
			}

			return account;
		}
	);

	useEffect(() => {
		const mutator = (accounts) => mutate(accounts[0] ?? null);
		provider?.on('accountsChanged', mutator);

		console.log(provider);

		return () => {
			provider?.removeListener('accountsChanged', mutator);
		};
	}, [provider]);

	return {
		data,
		isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
		mutate,
		...rest,
	};
};
