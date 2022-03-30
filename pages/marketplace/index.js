import { useWalletInfo, useOwnedGames } from '@components/hooks/web3';
import { Button, Loader, Message } from '@components/ui/common';
import { CourseCard, CourseList, OwnedCourseCard } from '@components/ui/course';
import { GameList, GameCard } from '@components/ui/game';
import { BaseLayout } from '@components/ui/layout';
import { GameMarketHeader, MarketHeader } from '@components/ui/marketplace';
import { OrderModal, GameModal } from '@components/ui/order';
import { useState } from 'react';
import { useWeb3 } from '@components/providers';
import { withToast } from '@utils/toast';
import { fetchSteamGames } from '@utils/fetchSteamGames';
import { getAllGames } from '@content/steams/fetcher';
export default function GameMarketPlace({ games }) {
	const { web3, contract, requireInstall } = useWeb3();
	const { hasConnectedWallet, isConnecting, account } = useWalletInfo();
	const { ownedGames } = useOwnedGames(games, account.data);

	const [selectedGame, setSelectedGame] = useState(null);
	const [busyCourseId, setBusyCourseId] = useState(null);
	const [isNewPurchase, setIsNewPurchase] = useState(true);

	console.log(games);

	const purchaseCourse = async (order, game) => {
		const hexCourseId = web3.utils.utf8ToHex(String(game.steam_appid));
		const orderHash = web3.utils.soliditySha3(
			{ type: 'bytes16', value: hexCourseId },
			{ type: 'address', value: account.data }
		);

		const value = web3.utils.toWei(String(order.price), 'ether');

		setBusyCourseId(game.steam_appid);
		if (isNewPurchase) {
			const emailHash = web3.utils.sha3(order.email);
			const proof = web3.utils.soliditySha3(
				{ type: 'bytes32', value: emailHash },
				{ type: 'bytes32', value: orderHash }
			);

			withToast(_purchaseCourse({ hexCourseId, proof, value }, game));
		} else {
			withToast(_repurchaseCourse({ courseHash: orderHash, value }, game));
		}
	};

	const _purchaseCourse = async ({ hexCourseId, proof, value }, game) => {
		try {
			const results = await contract.methods
				.purchaseCourse(hexCourseId, proof)
				.send({ from: account.data, value });
			ownedGames.mutate([
				...ownedGames.data,
				{
					...game,
					proof,
					state: 'purchased',
					owner: account.data,
					price: value,
				},
			]);
			return results;
		} catch (error) {
			throw new Error(error.message);
		} finally {
			setBusyCourseId(null);
		}
	};

	const _repurchaseCourse = async ({ courseHash, value }, game) => {
		try {
			const results = await contract.methods
				.repurchaseCourse(courseHash)
				.send({ from: account.data, value });

			const index = ownedGames.data.findIndex(
				(c) => c.steam_appid === game.steam_appid
			);
			if (index >= 0) {
				ownedGames.data[index].state = 'purchased';
				ownedGames.mutate(ownedGames.data);
			} else {
				ownedGames.mutate();
			}
			return results;
		} catch (error) {
			throw new Error(error.message);
		} finally {
			setBusyCourseId(null);
		}
	};

	const notify = () => {
		const resolveWithSomeData = new Promise((resolve) =>
			setTimeout(
				() =>
					resolve({
						transactionHash:
							'0xf8aeb4d8a85e21f4b3492121b2e974cd349128701d4eab2f0b801e40e0d55cb7',
					}),
				3000
			)
		);
		// const resolveWithSomeData = new Promise((resolve, reject) =>
		// 	setTimeout(() => reject(new Error('Some Error')), 3000)
		// );
		withToast(resolveWithSomeData);
	};

	const cleanupModal = () => {
		setSelectedGame(null);
		setIsNewPurchase(true);
	};

	return (
		<>
			<GameMarketHeader />
			{/* <Button onClick={notify}>Notify</Button> */}

			<GameList games={games}>
				{(game) => {
					const owned = ownedGames.lookup[game.steam_appid];
					return (
						<GameCard
							disabled={!hasConnectedWallet}
							key={game.steam_appid}
							state={owned?.state}
							game={game}
							Footer={() => {
								if (requireInstall) {
									return (
										<Button
											size="sm"
											disabled={true}
											variant="lightPurple"
											hoverable={hasConnectedWallet}
										>
											Install
										</Button>
									);
								}

								if (isConnecting) {
									return (
										<Button
											size="sm"
											disabled={true}
											variant="lightPurple"
											hoverable={hasConnectedWallet}
										>
											<Loader size="sm" />
										</Button>
									);
								}

								if (!ownedGames.hasInitialResponse) {
									// return <div style={{ height: '42px' }}></div>;
									return (
										<Button variant="white" disabled={true} size="sm">
											{hasConnectedWallet ? 'Loading State...' : 'Connect'}
										</Button>
									);
								}

								const isBusy = busyCourseId === game.steam_appid;
								if (owned) {
									return (
										<>
											<div className="flex">
												<Button
													onClick={() => alert('You are owner of this game')}
													size="sm"
													disabled={false}
													variant="white"
												>
													Yours &#10003;
												</Button>
												{owned.state === 'deactivated' && (
													<div className="ml-1">
														<Button
															size="sm"
															disabled={isBusy}
															variant="purple"
															onClick={() => {
																setIsNewPurchase(false);
																setSelectedGame(game);
															}}
														>
															{isBusy ? (
																<div className="flex">
																	<Loader size="sm" />
																	<div className="ml-2">In Progress</div>
																</div>
															) : (
																<div>Fund to Activate</div>
															)}
														</Button>
													</div>
												)}
											</div>
										</>
									);
								}

								return (
									<Button
										size="sm"
										disabled={!hasConnectedWallet || isBusy}
										variant="lightPurple"
										hoverable={hasConnectedWallet}
										onClick={() => {
											setSelectedGame(game);
										}}
									>
										{isBusy ? (
											<div className="flex">
												<Loader size="sm" />
												<div className="ml-2">In Progress</div>
											</div>
										) : (
											<div>Purchase</div>
										)}
									</Button>
								);
							}}
						/>
					);
				}}
			</GameList>
			{selectedGame && (
				<GameModal
					isNewPurchase={isNewPurchase}
					onClose={cleanupModal}
					onSubmit={(formData, game) => {
						purchaseCourse(formData, game);
						cleanupModal();
					}}
					game={selectedGame}
				/>
			)}
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
	const {data} = getAllGames();
	// const data = await fetchDetailGame(1855390);
	// Retrieving assets from OPENSEA API
	if (!data) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			games: data,
		}, // will be passed to the page component as props
	};
}

GameMarketPlace.Layout = BaseLayout;
