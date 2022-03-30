import { createCourseHash } from '@utils/hash';
import { normalizeOwnedCourse } from '@utils/normalize';
import useSWR from 'swr';

export const handler = (web3, contract) => (games, account) => {
	const swrRes = useSWR(
		() => (web3 && contract && account ? `web3/ownedGames/${account}` : null),
		async () => {
			const ownedGames = [];

			for (let i = 0; i < games.length; i++) {
				const game = games[i];

				if (!games[i].steam_appid) {
					continue;
				}

				const courseHash = createCourseHash(web3)(game.steam_appid, account);
				const ownedGame = await contract.methods
					.getCourseByHash(courseHash)
					.call();

				if (ownedGame.owner !== '0x0000000000000000000000000000000000000000') {
					const normalized = normalizeOwnedCourse(web3)(game, ownedGame);
					ownedGames.push(normalized);
				}
			}

			return ownedGames;
		}
	);

	return {
		...swrRes,
		lookup:
			(swrRes.data &&
				swrRes.data?.reduce((a, c) => {
					a[c.steam_appid] = c;
					return a;
				}, {})) ??
			{},
	};
};
