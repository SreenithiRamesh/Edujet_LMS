import React, { useContext ,useEffect,useState} from 'react';
import { AppContext } from '../../Context/AppContext';
import SearchBar from '../../Components/Students/SearchBar/SearchBar';
import { useParams } from 'react-router-dom';
import CourseCard from '../../Components/Students/CourseCard/CourseCard';
import { assets } from '../../assets/assets';
import Footer from '../../Components/Students/Footer/Footer';

const CourseList = () => {
  const {navigate,AllCourses} =useContext(AppContext)
  const {input}=useParams()
  const [filteredCourse,setFilteredCourse]=useState([])

  useEffect(()=>{
    if(AllCourses && AllCourses.length>0){
      const tempcourses=AllCourses.slice()

      input?
      setFilteredCourse(
        tempcourses.filter(
          item=> item.courseTitle.toLowerCase().includes(input.toLowerCase())
        )
      )
      :setFilteredCourse(tempcourses)
    }
  },[AllCourses,input])
  return (
    <>
    
    <div className='relative ms:px-36 px-8 pt-20 text-left max-w-[90%] mx-auto'>
      <div className='flex md:flex-row flex-col gap-6 justify-between items-start w-full'>

        <div>
        <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
        <p className='text-gray-500'><span className='text-blue-600 cursor-pointer'
        onClick={()=>navigate("/")}>Home</span>/<span>Course List</span></p>
        </div>
        <SearchBar data={input}/>
      </div>
      {input && <div className='inline-flex items-center bg-white shadow-2xs rounded-sm border-gray-500/20  gap-4 px-4 py-2 border mt-8 text-gray-600'>
        
        <p>{input}</p>
        <img src={assets.cross_icon} alt=" "
        className='cursor-pointer' onClick={()=> navigate('/course-list')}/>
        </div>}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0'>
  {filteredCourse.map((course,index)=> <CourseCard key={index} course={course}/> )}
</div>
      </div>
<Footer/>
 
    </>
  );
}

export default CourseList;
