import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../Context/AppContext';
import CourseCard from '../CourseCard/CourseCard';

const CourseSection = () => {
  // FIXED: Corrected the casing to match context
  const { AllCourses } = useContext(AppContext);

  return (
    <div className='py-5 md:px-40 px-8 items-center justify-center flex flex-col'>
      <h2 className="md:text-[28px] text-[20px] font-medium text-gray-800 text-center">
        Your Gateway to <span className='text-[#0d47a1]'>Learn. Apply. Lead.</span>
      </h2>
      <p className="mt-3 md:block hidden text-gray-500 max-w-2xl mx-auto text-center text-sm md:text-base">
        EduJet is your launchpad to success.
      </p>
      <p className="mt-3 md:hidden text-gray-500 max-w-sm mx-auto text-center text-sm md:text-base">
        EduJet is your launchpad to success.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-4 md:px-0 md:my-10 my-10  gap-4 mt-6">
        {/* FIXED: Check if AllCourses is an array before using slice/map */}
        {Array.isArray(AllCourses) && AllCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      <Link to={'/course-list'} onClick={() => scrollTo(0, 0)}
        className='text-xs sm:text-sm md:text-base bg-white text-[#0D47A1] font-semibold px-5 py-3 rounded-lg shadow-md border border-[#0D47A1] hover:bg-[#e3f2fd] transition duration-300'>
        Show all courses
      </Link>
    </div>
  );
};

export default CourseSection;
