/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-constant-condition */
import React, { useContext, useEffect,useState } from "react";
import { assets } from '../../assets/assets';
import YouTube from "react-youtube";
import humanizeDuration from "humanize-duration";
import { AppContext } from "../../Context/AppContext";
import { useParams } from "react-router-dom";
import Footer from '../../Components/Students/Footer/Footer';
import CourseRating from "../../Components/Students/CourseRating/CourseRating";

const CourseVideo = () => {
 

  const { enrolledCourses, calChapterTime } = useContext(AppContext)
  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [Open, setOpen] = useState({});
  const [Video, setVideo] = useState(null);
  
  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course)
      }
    })
  }
  
useEffect(() => {
      getCourseData()
    
  }, [enrolledCourses]);


  const toggleSection = (index) => {
          setOpen((prev) => ({
            ...prev,
            [index]: !prev[index],
          }));
        };


  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };



   
  return (
    <>

    <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10
    md:px-36'>
      <div className='text-gray-800'>
        <h2 className='text-xl font-semibold '>
Course Structure
        </h2>
        <div className="pt-5">
{courseData && courseData.courseContent.map((chapter, index) => (
  <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
    <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none" onClick={() => toggleSection(index)}>
      <div className="flex items-center gap-2">
        <img src={assets.down_arrow_icon} alt="icon" className={`transition-transform duration-300 ${Open[index] ? "rotate-180" : "rotate-0"}`} />
        <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
      </div>
      <p className="text-sm md:text-[15px]">
        {chapter.chapterContent.length} lectures - {calChapterTime(chapter)}
      </p>
    </div>

    <div className={`overflow-hidden transition-all duration-300 ${Open[index] ? "max-h-96" : "max-h-0"}`}>
      <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
        {chapter.chapterContent.map((lecture, i) => (
          <li key={i} className="flex items-start gap-2 py-1">
            <img src={false ? assets.blue_tick_icon : assets.play_icon} alt="icon" className="w-4 h-3  mt-1" />
            <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-[14px]">
              <p>{lecture.lectureTitle}</p>
              <div className="flex gap-2">
              <p
  onClick={() => {
    const videoId = extractVideoId(lecture.lectureUrl);
    if (videoId) {
      setVideo({
        ...lecture,
        videoId,
        chapter: index + 1,
        lecture: i + 1,
      });
    }
  }}
  className="text-blue-500 cursor-pointer"
>
  Watch
</p>

                <p>
                  {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                    units: ["h", "m"],
                  })}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
))}
</div>
<CourseRating onSubmit={(rating) => alert(`Thank you for rating this course ${rating} stars!`)} />

      </div>
<div className="md:mt-10">
{Video ?(
  <div>
    <YouTube videoId={Video.lectureUrl.split('/').pop()} iframeClassName="
    w-full aspect-video"/>
    <div className="flex justify-between items-center mt-5 shadow-sm p-1">
      <p>
        {Video.chapter}.{Video.lecture}{Video.lectureTitle}
      </p>

      <button className="text-xs sm:text-sm md:text-base bg-gradient-to-r cursor-pointer from-[#64B5F6] via-[#1E88E5] to-[#0D47A1] text-white font-semibold px-3 py-2 rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition duration-300">
       
        {false ? 'Completed' : 'Mark as Complete'}</button>
    </div>
  </div>
):
<img src={courseData  ? courseData.courseThumbnail : ''} alt="img"/>
}

  
</div>
    </div>
    <Footer/>
   </>
  );
}

export default CourseVideo;

