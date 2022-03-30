import axios from 'axios';

export const fetchSteamGames = async () => {
	const response = await axios.get(
		'https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json'
	);
	const tenSteamGames = response.data.applist.apps.slice(71, 81);
	console.log(tenSteamGames);
	const gamesDetail = await mapAsync(tenSteamGames);

	console.log(gamesDetail);

	return gamesDetail;
};

const mapAsync = async (steamGames) => {
	const promises = steamGames.map(async (game) => {
		const gameData = await fetchDetailGame(game.appid);
		return gameData;
	});

	return Promise.all(promises);
};

export const fetchDetailGame = async (appId) => {
	const response = await axios.get(
		`https://store.steampowered.com/api/appdetails?appids=${appId}`
	);

	return response.data[appId]['data'];
};
