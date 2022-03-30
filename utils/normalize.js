export const COURSE_STATES = {
	0: 'purchased',
	1: 'activated',
	2: 'deactivated',
};

export const GAME_STATES = {
	0: 'purchased',
	1: 'activated',
	2: 'deactivated',
};

// export const normalizeOwnedCourse = (web3) => (course, ownedCourse) => {
// 	return {
// 		...course,
// 		ownedCourseId: ownedCourse.id,
// 		proof: ownedCourse.proof,
// 		owned: ownedCourse.owner,
// 		price: web3.utils.fromWei(ownedCourse.price),
// 		state: COURSE_STATES[ownedCourse.state],
// 	};
// };

export const normalizeOwnedCourse = (web3) => (game, ownedGame) => {
	return {
		...game,
		ownedGameId: ownedGame.id,
		proof: ownedGame.proof,
		owned: ownedGame.owner,
		price: web3.utils.fromWei(ownedGame.price),
		state: COURSE_STATES[ownedGame.state],
	};
};
