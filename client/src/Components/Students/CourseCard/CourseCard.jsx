import React, { useContext } from 'react';
import {assets} from '../../../assets/assets'
import { AppContext } from '../../../Context/AppContext';
import { Link } from 'react-router-dom';
const CourseCard = ({course}) => {

const {currency,calRating}=useContext(AppContext)

  return (
    <Link to={'/course/'+course._id} onClick={()=> scrollTo(0,0,)}
    className='border border-[#64b5f6] pb-6 overflow-hidden rounded-lg bg-[#EFF6FF] shadow-md'>
   <img src={course.courseThumbnail} alt="thumbnail" className='w-full'/>
   <div className='p-3 text-left'>
    <h3 className='text-base font-semibold '>
      {course.courseTitle}
    </h3>
    <p className='text-gray-500 '>
      {course.educator.name}
    </p>
    <div className='flex items-center space-x-2'>
      <p>
    {calRating(course)}
      </p>
      <div className='flex'>
        {[...Array(5)].map((_,i)=>(<img key={i} src={i< Math.floor (calRating(course)) ? assets.star:assets.star_blank } className="w-3.5 h-3.5"alt="star_img"/>))}
      </div>
      <p className='text-gray-300'>{course.courseRatings.length}</p>
    </div>
    <p className='text-base font-semibold text-gray-800'>{currency}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}</p>
   </div>

    </Link>
  );
}

export default CourseCard;
