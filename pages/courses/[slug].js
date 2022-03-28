import { Modal, Message } from '@components/ui/common';
import {
	CourseCurriculum,
	CourseHero,
	CourseKeypoints,
} from '@components/ui/course';
import { BaseLayout } from '@components/ui/layout';
import { getAllCourse } from '@content/courses/fetcher';
import { useOwnedCourse, useAccount } from '@components/hooks/web3';
import { useWeb3 } from '@components/providers';

export default function Course({ course }) {
	const { isLoading } = useWeb3();
	const { account } = useAccount();
	const { ownedCourse } = useOwnedCourse(course, account.data);
	const courseState = ownedCourse.data?.state;
	// const courseState = 'deactivated';

	const isLocked =
		!courseState ||
		courseState === 'purchased' ||
		courseState === 'deactivated';

	return (
		<>
			<div className="py-4">
				<CourseHero
					hasOwner={!!ownedCourse.data}
					title={course.title}
					description={course.description}
					image={course.coverImage}
				/>
			</div>

			<CourseKeypoints points={course.wsl} />
			{courseState && (
				<div className="max-w-5xl mx-auto">
					{courseState === 'purchased' && (
						<Message type="warning">
							Course is purchased and waiting for activation. Process can take
							up to 24 hours.
							<i className="block font-normal">
								In case of any questions, please contact info@gmail.com
							</i>
						</Message>
					)}
					{courseState === 'activated' && (
						<Message type="success">I wish you happy watching.</Message>
					)}
					{courseState === 'deactivated' && (
						<Message type="danger">
							Course has been deactivated, due to the incorrect purchase data.
							The functionality to watch the course has been temporaly disabled
							<i className="block font-normal">Please contact info@gmail.com</i>
						</Message>
					)}
				</div>
			)}

			<CourseCurriculum
				isLoading={isLoading}
				locked={isLocked}
				courseState={courseState}
			/>
			<Modal />
		</>
	);
}

export function getStaticPaths() {
	const { data } = getAllCourse();

	return {
		paths: data.map((c) => ({
			params: {
				slug: c.slug,
			},
		})),
		fallback: false,
	};
}

export function getStaticProps({ params }) {
	const { data } = getAllCourse();
	const course = data.filter((c) => c.slug === params.slug)[0];

	return {
		props: { course },
	};
}

Course.Layout = BaseLayout;
