import React from 'react';
import { GameMarketHeader } from '@components/ui/marketplace';
import { OwnedCourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { Button, Message } from '@components/ui/common';
import {
	useOwnedCourses,
	useAccount,
	useWalletInfo,
	useOwnedGames,
} from '@components/hooks/web3';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useWeb3 } from '@components/providers';
import { fetchSteamGames } from '@utils/fetchSteamGames';
import { OwnedGameCard } from '@components/ui/game';
import { getAllGames } from '@content/steams/fetcher';

export default function OwnedCourses({ games }) {
	const router = useRouter();
	const { requireInstall } = useWeb3();
	const { account } = useAccount();
	const { ownedGames } = useOwnedGames(games, account.data);

	return (
		<>
			<GameMarketHeader />
			<section className="grid grid-cols-1">
				{ownedGames.isEmpty && (
					<div className="w-1/2">
						<Message type="warning">
							<div>You don&apos;t own any courses</div>
							<Link href="/marketplace">
								<a className="font-normal hover:underline">
									<i>Purchase Course</i>
								</a>
							</Link>
						</Message>
					</div>
				)}
				{account.isEmpty && (
					<div className="w-1/2">
						<Message type="warning">
							<div>Please connect to Metamask.</div>
						</Message>
					</div>
				)}
				{requireInstall && (
					<div className="w-1/2">
						<Message type="warning">
							<div>Please install metamask.</div>
						</Message>
					</div>
				)}
				{ownedGames.data?.map((game) => (
					<OwnedGameCard key={game.steam_appid} game={game}>
						<Message type="warning">My Custom Message</Message>
						<Button onClick={() => router.push(`/games/${game.steam_appid}`)}>
							Watch the game
						</Button>
					</OwnedGameCard>
				))}
			</section>
		</>
	);
}

// export function getStaticProps() {
// 	const { data } = getAllCourse();
// 	return {
// 		props: {
// 			courses: data,
// 		},
// 	};
// }

// export async function getStaticProps() {
// 	const data = await fetchSteamGames();
// 	// const data = await fetchDetailGame(1855390);
// 	// Retrieving assets from OPENSEA API
// 	if (!data) {
// 		return {
// 			notFound: true,
// 		};
// 	}

// 	return {
// 		props: {
// 			games: data,
// 		}, // will be passed to the page component as props
// 	};
// }

export function getStaticProps() {
	const data = getAllGames();
	// const data = await fetchDetailGame(1855390);
	// Retrieving assets from OPENSEA API

	return {
		props: {
			games: data,
		}, // will be passed to the page component as props
	};
}

OwnedCourses.Layout = BaseLayout;
