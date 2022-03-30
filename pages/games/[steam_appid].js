import { Modal, Message } from '@components/ui/common';
import { GameHero, GameKeypoints, GameCurriculum } from '@components/ui/game';
import { BaseLayout } from '@components/ui/layout';
import { getAllCourse } from '@content/courses/fetcher';
import { useOwnedGame, useAccount } from '@components/hooks/web3';
import { useWeb3 } from '@components/providers';
import { fetchSteamGames } from '@utils/fetchSteamGames';

export default function Game({ game }) {
	const { isLoading } = useWeb3();
	const { account } = useAccount();
	const { ownedGame } = useOwnedGame(game, account.data);
	const gameState = ownedGame.data?.state;
	// const gameState = 'deactivated';

	const isLocked =
		!gameState ||
		gameState === 'purchased' ||
		gameState === 'deactivated';

	return (
		<>
			<div className="py-4">
				<GameHero
					hasOwner={!!ownedGame.data}
					title={game.name}
					description={game.short_description}
					image={game.header_image}
				/>
			</div>

			<GameKeypoints categories={game.categories} />
			{gameState && (
				<div className="max-w-5xl mx-auto">
					{gameState === 'purchased' && (
						<Message type="warning">
							Game is purchased and waiting for activation. Process can take
							up to 24 hours.
							<i className="block font-normal">
								In case of any questions, please contact kingauther33@gmail.com
							</i>
						</Message>
					)}
					{gameState === 'activated' && (
						<Message type="success">I wish you happy watching.</Message>
					)}
					{gameState === 'deactivated' && (
						<Message type="danger">
							Game has been deactivated, due to the incorrect purchase data.
							The functionality to watch the course has been temporaly disabled
							<i className="block font-normal">Please contact kingauther33@gmail.com</i>
						</Message>
					)}
				</div>
			)}

			<GameCurriculum
				isLoading={isLoading}
				locked={isLocked}
				gameState={gameState}
			/>
			<Modal />
		</>
	);
}

export async function getStaticPaths() {
	const data = await fetchSteamGames();

	return {
		paths: data.map((c) => ({
			params: {
				steam_appid: String(c.steam_appid),
			},
		})),
		fallback: false,
	};
}

// export function getStaticProps({ params }) {
// 	const { data } = getAllCourse();
// 	const course = data.filter((c) => c.slug === params.slug)[0];

// 	return {
// 		props: { course },
// 	};
// }

export async function getStaticProps({ params }) {
	const data = await fetchSteamGames();
	// const data = await fetchDetailGame(1855390);
	// Retrieving assets from OPENSEA API

	const game = data.filter((c) => c.steam_appid == params.steam_appid)[0];

	console.log(game);

	if (!game) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			game,
		}, // will be passed to the page component as props
	};
}

Game.Layout = BaseLayout;
