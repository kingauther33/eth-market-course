import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimateKeyframes } from 'react-simple-animate';

const Card = ({ game, disabled, Footer, state }) => {
	return (
		<div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl w-full">
			<div className="flex h-full">
				<div className="flex-1 h-full next-image-wrapper">
					<Image
						className={`object-cover ${disabled && 'filter grayscale'}`}
						src={game.header_image}
						layout="fixed"
						width="200"
						height="230"
						alt={game.title}
					/>
				</div>
				<div className="p-8 pb-4 flex-2">
					<div className="flex items-center">
						<div className="uppercase mr-2 tracking-wide text-sm text-indigo-500 font-semibold">
							{game.type}
						</div>
						<div>
							{state === 'activated' && (
								<div className="text-xs text-black font-semibold bg-green-200 p-1 px-3 rounded-full">
									Activated
								</div>
							)}
							{state === 'deactivated' && (
								<div className="text-xs text-black font-semibold bg-red-200 p-1 px-3 rounded-full">
									Deactivated
								</div>
							)}
							{state === 'purchased' && (
								<AnimateKeyframes
									play
									duration={2}
									keyframes={['opacity: 0', 'opacity: 1']}
									iterationCount="infinite"
								>
									<div className="text-xs text-black font-semibold bg-yellow-200 p-1 px-3 rounded-full">
										Pending
									</div>
								</AnimateKeyframes>
							)}
						</div>
					</div>
					<Link href={`/games/${game.steam_appid}`}>
						<a className="h-12 block mt-1 text-sm sm:text-base leading-tight font-medium text-black hover:underline">
							{game.name}
						</a>
					</Link>
					<p className="mt-2 mb-4 text-sm sm:text-base text-gray-500">
						{game.short_description.substring(0, 70)}...
					</p>
					{Footer && (
						<div className="mt-2">
							<Footer />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Card;
