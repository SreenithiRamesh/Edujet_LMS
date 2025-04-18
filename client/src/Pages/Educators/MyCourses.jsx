import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../Components/Students/Loading/Loading';

const MyCourses = () => {
  const { currency, AllCourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setCourses(AllCourses);
  }, [AllCourses]);

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'all') return matchesSearch;
    if (filter === 'published') return matchesSearch && course.isPublished;
    if (filter === 'draft') return matchesSearch && !course.isPublished;
    if (filter === 'top') return matchesSearch && course.enrolledStudents.length >= 50;
    return false;
  });

  return courses ? (
    <div className="min-h-screen bg-white w-full px-4 md:px-10 py-8">
      <h2 className="text-2xl font-bold text-[#1565C0] mb-6">My Courses</h2>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          className="px-4 py-2 w-full sm:w-72 border border-[#90CAF9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1976D2]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="px-3 py-2 border border-[#90CAF9] rounded-md text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="top">Top Enrolled</option>
        </select>
      </div>

      {/* Table for larger screens */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-[#BBDEFB] mt-6 hidden sm:block">
        <table className="min-w-full table-auto">
          <thead className="text-[#1565C0] bg-[#E3F2FD] text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Course</th>
              <th className="px-4 py-3 font-semibold">Earnings</th>
              <th className="px-4 py-3 font-semibold">Students</th>
              <th className="px-4 py-3 font-semibold">Published On</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredCourses.map(course => (
              <tr key={course.id} className="border-b border-gray-200 hover:bg-[#F1F8FF]">
                <td className="px-4 py-3 flex items-center space-x-3">
                  <img
                    src={course.courseThumbnail}
                    alt="thumbnail"
                    className="w-14 h-14 object-cover rounded shadow"
                  />
                  <div>
                    <div className="font-medium text-[#1976D2]">{course.courseTitle}</div>
                    <div className="text-xs text-gray-500">
                      {course.isPublished ? (
                        <span className="text-green-600">Published</span>
                      ) : (
                        <span className="text-yellow-600">Draft</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}
                </td>
                <td className="px-4 py-3">{course.enrolledStudents.length}</td>
                <td className="px-4 py-3">
                  {new Date(course.CreatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">No courses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card Layout for smaller screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 sm:hidden">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
            <img
              src={course.courseThumbnail}
              alt="thumbnail"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <div className="font-medium text-[#1976D2] text-lg mb-2">{course.courseTitle}</div>
            <div className="text-xs text-gray-500 mb-2">
              {course.isPublished ? (
                <span className="text-green-600">Published</span>
              ) : (
                <span className="text-yellow-600">Draft</span>
              )}
            </div>
            <div className="text-sm text-gray-700 mb-4">
              <strong>{currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}</strong>
            </div>
            <div className="text-sm text-gray-500">
              Students Enrolled: {course.enrolledStudents.length}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Published On: {new Date(course.CreatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-3 text-center py-6 text-gray-500">No courses found.</div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
