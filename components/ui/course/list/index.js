import React from 'react';

const CourseList = ({ courses, children }) => {
	return (
		<section className="grid md:grid-cols-1 lg:grid-cols-2 md:mx-auto gap-4 mb-5 md:justify-items-center">
			{courses.map((course) => children(course))}
		</section>
	);
};

export default CourseList;
