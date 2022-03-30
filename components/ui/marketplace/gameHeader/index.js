import React from 'react';
import { WalletBar, EthRates } from '@components/ui/web3';
import { BreadCrumb, GameBreadCrumb } from '@components/ui/common';
import { useAccount } from '@components/hooks/web3';

const LINKS = [
	{
		href: '/marketplace',
		value: 'Buy',
	},
	{
		href: '/marketplace/games/owned',
		value: 'My Courses',
	},
	{
		href: '/marketplace/games/managed',
		value: 'Manage Courses',
		requireAdmin: true,
	},
];

export default function GameHeader() {
	const { account } = useAccount();
	return (
		<>
			<div className="pt-4">
				<WalletBar />
			</div>
			<EthRates />
			<div className="flex flex-row-reverse p-4 sm:px-6 lg:px-8">
				<GameBreadCrumb isAdmin={account.isAdmin} items={LINKS} />
			</div>
		</>
	);
}
