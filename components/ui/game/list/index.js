import React from 'react';

const GameList = ({ games, children }) => {
	return (
		<section className="grid md:grid-cols-1 lg:grid-cols-2 md:mx-auto gap-4 mb-5 md:justify-items-center">
			{games.map((game) => children(game))}
		</section>
	);
};

export default GameList;
