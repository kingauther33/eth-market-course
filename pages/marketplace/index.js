import { useWalletInfo, useOwnedCourses } from '@components/hooks/web3';
import { Button, Loader, Message } from '@components/ui/common';
import { CourseCard, CourseList, OwnedCourseCard } from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { MarketHeader } from '@components/ui/marketplace';
import { OrderModal } from '@components/ui/order';
import { getAllCourse } from '@content/courses/fetcher';
import { useState } from 'react';
import { useWeb3 } from '@components/providers';
import { withToast } from '@utils/toast';
export default function MarketPlace({ courses }) {
	const { web3, contract, requireInstall } = useWeb3();
	const { hasConnectedWallet, isConnecting, account } = useWalletInfo();
	const { ownedCourses } = useOwnedCourses(courses, account.data);

	const [selectedCourse, setSelectedCourse] = useState(null);
	const [busyCourseId, setBusyCourseId] = useState(null);
	const [isNewPurchase, setIsNewPurchase] = useState(true);

	const purchaseCourse = async (order, course) => {
		const hexCourseId = web3.utils.utf8ToHex(course.id);
		const orderHash = web3.utils.soliditySha3(
			{ type: 'bytes16', value: hexCourseId },
			{ type: 'address', value: account.data }
		);

		const value = web3.utils.toWei(String(order.price), 'ether');

		setBusyCourseId(course.id);
		if (isNewPurchase) {
			const emailHash = web3.utils.sha3(order.email);
			const proof = web3.utils.soliditySha3(
				{ type: 'bytes32', value: emailHash },
				{ type: 'bytes32', value: orderHash }
			);

			withToast(_purchaseCourse({ hexCourseId, proof, value }, course));
		} else {
			withToast(_repurchaseCourse({ courseHash: orderHash, value }, course));
		}
	};

	const _purchaseCourse = async ({ hexCourseId, proof, value }, course) => {
		try {
			const results = await contract.methods
				.purchaseCourse(hexCourseId, proof)
				.send({ from: account.data, value });
			ownedCourses.mutate([
				...ownedCourses.data,
				{
					...course,
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

	const _repurchaseCourse = async ({ courseHash, value }, course) => {
		try {
			const results = await contract.methods
				.repurchaseCourse(courseHash)
				.send({ from: account.data, value });

			const index = ownedCourses.data.findIndex((c) => c.id === course.id);
			if (index >= 0) {
				ownedCourses.data[index].state = 'purchased';
				ownedCourses.mutate(ownedCourses.data);
			} else {
				ownedCourses.mutate();
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
		setSelectedCourse(null);
		setIsNewPurchase(true);
	};

	return (
		<>
			<MarketHeader />
			<Button onClick={notify}>Notify</Button>

			<CourseList courses={courses}>
				{(course) => {
					const owned = ownedCourses.lookup[course.id];
					return (
						<CourseCard
							disabled={!hasConnectedWallet}
							key={course.id}
							state={owned?.state}
							course={course}
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

								if (!ownedCourses.hasInitialResponse) {
									// return <div style={{ height: '42px' }}></div>;
									return (
										<Button variant="white" disabled={true} size="sm">
											Loading State...
										</Button>
									);
								}

								const isBusy = busyCourseId === course.id;
								if (owned) {
									return (
										<>
											<div className="flex">
												<Button
													onClick={() => alert('You are owner of this course')}
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
																setSelectedCourse(course);
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
											setSelectedCourse(course);
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
			</CourseList>
			{selectedCourse && (
				<OrderModal
					isNewPurchase={isNewPurchase}
					onClose={cleanupModal}
					onSubmit={(formData, course) => {
						purchaseCourse(formData, course);
						cleanupModal();
					}}
					course={selectedCourse}
				/>
			)}
		</>
	);
}

export function getStaticProps() {
	const { data } = getAllCourse();
	return {
		props: {
			courses: data,
		},
	};
}

MarketPlace.Layout = BaseLayout;
