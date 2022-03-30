import { Hero } from '@components/ui/common';
import { CourseCard, CourseList } from '@components/ui/course';
import { GameCard, GameList } from '@components/ui/game';
import { getAllCourse } from '@content/courses/fetcher';
import { BaseLayout } from '@components/ui/layout';
import {fetchSteamGames} from '@utils/fetchSteamGames'

export default function Home({ games }) {
	return (
		<>
			<Hero />
			<GameList games={games}>
				{(game) => <GameCard key={game.id} game={game} />}
			</GameList>
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
			games: data,
		}, // will be passed to the page component as props
	};
}

Home.Layout = BaseLayout;
