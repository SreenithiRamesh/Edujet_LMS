import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {Line} from 'rc-progress'
import Footer from "../../Components/Students/Footer/Footer";
const MyEnrollments = () => {
  const { enrolledCourses, calCourseDuration ,navigate} = useContext(AppContext);
  const [progressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 3 },
    { lectureCompleted: 5, totalLectures: 7 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 2, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 10 },
    { lectureCompleted: 3, totalLectures: 5 },
    { lectureCompleted: 7, totalLectures: 7 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 2 },
    { lectureCompleted: 5, totalLectures: 5 }
  ]);

  return (
    <>
    <div className="md:px-36 px-6 pt-10 bg-white min-h-screen mb-10">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">My Enrollments</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-blue-200 bg-blue-50 rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-blue-900 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Completed</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="text-blue-900 text-sm divide-y divide-blue-200">
            {enrolledCourses.map((course, index) => (
              <tr key={index} className="hover:bg-blue-100 transition-all">
                <td className="px-4 py-4 md:pl-4 pl-2 flex gap-3 items-center flex-wrap md:flex-nowrap">
                  <img
                    src={course.courseThumbnail}
                    alt="Course Thumbnail"
                    className="w-16 h-16 object-cover rounded-md shadow"
                  />
                  <div className="flex-1">

                
                  <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                  <Line strokeWidth={2} percent={progressArray[index]?(progressArray[index]
                    .lectureCompleted*100)/ progressArray[index].totalLectures : 0 } className="bg-gray-300 rounded-full"/>
                  </div>
                </td>
                <td className="px-4 py-4">{calCourseDuration(course)}</td>
                <td className="px-4 py-3 ">
                  {progressArray[index] &&
                    `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures} Lectures`}
                </td>

                <td className="px-4 py-4">
                <button
  className={`${
    progressArray[index] &&
    progressArray[index].lectureCompleted /
      progressArray[index].totalLectures === 1
      ? "bg-green-200 text-green-800"
      : "lg:bg-blue-200 text-blue-800"
  } px-3 py-2 rounded text-xs font-semibold`}
  onClick={() => navigate("/course-video/" + course._id)}
>
  {progressArray[index] &&
  progressArray[index].lectureCompleted /
    progressArray[index].totalLectures === 1
    ? "Completed"
    : "On Going"}
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
    </div>
         <Footer/>
        </>
  );
};

export default MyEnrollments;
