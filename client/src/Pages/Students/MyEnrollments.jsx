import React, { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../Components/Students/Footer/Footer";
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/Students/Loading/Loading";

const MyEnrollments = () => {
  const {
    enrolledCourses,
    calCourseDuration,
    getCourseCompletion,
    progressData,
  } = useContext(AppContext);

  const navigate = useNavigate();

  if (!enrolledCourses) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-gray-600 text-lg mb-4">
          You haven't enrolled in any courses yet.
        </div>
        <button
          onClick={() => navigate("/courses")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Browse Courses
        </button>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="lg:px-36 md:px-8 px-4 pt-8 bg-white min-h-screen pb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6">
          My Enrollments
        </h1>

        <div className="hidden md:block overflow-x-auto shadow-md rounded-lg mb-8">
          <table className="min-w-full text-left border border-[#BBDEFB] bg-white">
            <thead className="bg-[#E3F2FD] text-[#1565C0]">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-sm uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left font-medium text-sm uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left font-medium text-sm uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left font-medium text-sm uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {enrolledCourses.map((course) => {
                const progressPercent = getCourseCompletion(course._id);
                const totalLectures = course.courseContent?.reduce(
                  (total, chap) => total + (chap.chapterContent?.length || 0),
                  0
                ) || 0;

                const completed =
                  progressData[course._id]?.lectureCompleted?.length || 0;

                return (
                  <tr
                    key={course._id}
                    className="hover:bg-[#F1F8FF] transition-colors cursor-pointer"
                    onClick={() => navigate(`/course-video/${course._id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={course.courseThumbnail}
                          alt={course.courseTitle}
                          className="w-12 h-12 object-cover rounded-md shadow mr-4"
                          onError={(e) => {
                            e.target.src = "/default-course-thumbnail.jpg";
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-blue-900 font-medium truncate">
                            {course.courseTitle}
                          </p>
                          <Line
                            strokeWidth={3}
                            percent={progressPercent}
                            strokeColor="#3B82F6"
                            trailColor="#EFF6FF"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-800">
                      {calCourseDuration(course)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-700 font-medium">{completed}</span>
                      <span className="text-blue-400"> / {totalLectures}</span>
                      <span className="block text-xs text-blue-500 mt-1">
                        {progressPercent}% complete
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`${
                          progressPercent === 100
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        } px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course-video/${course._id}`);
                        }}
                      >
                        {progressPercent === 100 ? "Completed" : "Continue"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {enrolledCourses.map((course) => {
            const progressPercent = getCourseCompletion(course._id);
            const totalLectures = course.courseContent?.reduce(
              (total, chap) => total + (chap.chapterContent?.length || 0),
              0
            ) || 0;

            const completed =
              progressData[course._id]?.lectureCompleted?.length || 0;

            return (
              <div
                key={course._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-100 cursor-pointer"
                onClick={() => navigate(`/course-video/${course._id}`)}
              >
                <div className="flex items-start">
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                    className="w-16 h-16 object-cover rounded-md shadow mr-4"
                    onError={(e) => {
                      e.target.src = "/default-course-thumbnail.jpg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-blue-900 font-medium truncate">
                      {course.courseTitle}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-blue-700">
                        {calCourseDuration(course)}
                      </span>
                      <span className="text-sm">
                        <span className="text-blue-600 font-medium">{completed}</span>
                        <span className="text-blue-300">/{totalLectures}</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <Line
                        strokeWidth={3}
                        percent={progressPercent}
                        strokeColor="#3B82F6"
                        trailColor="#EFF6FF"
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-blue-500">{progressPercent}% complete</span>
                        <button
                          className={`${
                            progressPercent === 100
                              ? "text-green-600"
                              : "text-blue-600"
                          } font-medium`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/course-video/${course._id}`);
                          }}
                        >
                          {progressPercent === 100 ? "Review" : "Continue"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;
