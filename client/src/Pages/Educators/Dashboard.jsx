import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../Context/AppContext';
import { assets } from '../../assets/assets';
import Loading from '../../Components/Students/Loading/Loading';
import axios from 'axios';

const Dashboard = () => {
  const { backendUrl, getToken, currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [darray, setDarray] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [viewedStudent, setViewedStudent] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(`${backendUrl}/api/educator/enrolled-students`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          const courses = await axios.get(`${backendUrl}/api/educator/courses`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const earningsRes = await axios.get(`${backendUrl}/api/educator/my-courses`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const totalEarnings = earningsRes.data.courses.reduce(
            (sum, course) => sum + course.totalEarnings, 0
          );

          setDashboardData({
            totalCourses: courses.data.courses.length,
            totalEarnings,
            enrolledStudentsData: data.enrolledStudents,
          });

          setDarray(data.enrolledStudents);
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
      }
    };

    fetchDashboard();
  }, []);

  const handleSortByDate = () => {
    const sorted = [...darray].sort((a, b) =>
      sortAsc
        ? new Date(a.purchaseDate) - new Date(b.purchaseDate)
        : new Date(b.purchaseDate) - new Date(a.purchaseDate)
    );
    setDarray(sorted);
    setSortAsc(!sortAsc);
  };

  const handleClear = () => {
    setSearchTerm('');
    setDarray(dashboardData?.enrolledStudentsData || []);
  };

  const handleView = (entry) => {
    setViewedStudent(entry);
  };

  const handleRemove = (entry) => {
    const updated = darray.filter(
      (item) =>
        item.student._id !== entry.student._id ||
        item.courseTitle !== entry.courseTitle
    );
    setDarray(updated);
  };

  const handleCloseModal = () => setViewedStudent(null);

  const filteredArray = darray.filter((entry) =>
    entry.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!dashboardData) return <Loading />;

  return (
    <div className='min-h-screen w-full p-4 md:p-8 flex flex-col gap-8 bg-white'>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1565C0]">Dashboard</h1>

      {/* Top Stats */}
      <div className='flex flex-col sm:flex-row flex-wrap gap-4'>
        {[
          {
            label: 'Total Enrollments',
            value: dashboardData.enrolledStudentsData.length,
            icon: assets.patients_icon,
          },
          {
            label: 'Total Courses',
            value: dashboardData.totalCourses,
            icon: assets.appointments_icon,
          },
          {
            label: 'Total Earnings',
            value: `${currency}${dashboardData.totalEarnings}`,
            icon: assets.earning_icon,
          },
        ].map((stat, i) => (
          <div key={i} className='flex items-center gap-4 shadow-md p-4 w-full sm:w-56 rounded-lg bg-[#E3F2FD] border border-[#64B5F6]'>
            <img src={stat.icon} alt={stat.label} className="w-10 h-10" />
            <div>
              <p className='text-xl font-semibold text-[#1565C0]'>{stat.value}</p>
              <p className='text-base text-[#64B5F6]'>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1565C0]">All Enrollments</h2>
        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full sm:w-72 border border-[#90CAF9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1976D2]"
          />
          <button
            onClick={handleSortByDate}
            className="text-white px-2 py-2 rounded-md bg-[#42A5F5] whitespace-nowrap"
          >
            Sort by Date {sortAsc ? '↑' : '↓'}
          </button>
          <button
            onClick={handleClear}
            className="text-gray-800 px-4 py-2 rounded-md bg-[#BBDEFB] whitespace-nowrap"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-[#BBDEFB] mt-6 hidden sm:block">
        <table className="min-w-full table-auto">
          <thead className="text-[#0D47A1] bg-[#E3F2FD] text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Course</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredArray.map((entry, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-[#F1F8FF]">
                <td className="md:px-4 px-2 py-3 text-[#1565C0] flex items-center space-x-3">
                  <img
                    src={entry.student.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${entry.student.name}`}
                    alt={entry.student.name}
                    className="w-12 h-12 rounded-full border-2 border-[#1565C0]"
                  />
                  <div>
                    <p className="font-medium">{entry.student.name}</p>
                    <p className="text-xs text-gray-500">{entry.student.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#1976D2]">{entry.courseTitle}</td>
                <td className="px-4 py-3 text-[#0D47A1]">{new Date(entry.purchaseDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => handleView(entry)} className="text-[#1E88E5] hover:underline text-sm">View</button>
                  <button onClick={() => handleRemove(entry)} className="text-red-500 hover:underline text-sm">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredArray.length === 0 && (
          <p className="text-center text-[#90CAF9] py-6">No matching enrollments found.</p>
        )}
      </div>

      {/* Modal */}
      {viewedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#e3f2fd] bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold mb-4 text-blue-800">Student Details</h3>
            <div className="flex items-center gap-4 mb-4">
              <img src={viewedStudent.student.imageUrl} alt={viewedStudent.student.name} className="w-16 h-16 rounded-full" />
              <div>
                <p className="font-semibold text-blue-900">{viewedStudent.student.name}</p>
                <p className="text-xs text-gray-600">{viewedStudent.student.email}</p>
                <p className="text-[#1E88E5]">{viewedStudent.courseTitle}</p>
              </div>
            </div>
            <p><strong>Purchased On:</strong> {new Date(viewedStudent.purchaseDate).toLocaleDateString()}</p>
            <div className="mt-4 text-right">
              <button
                onClick={handleCloseModal}
                className="text-xs sm:text-sm md:text-base bg-gradient-to-r from-[#64B5F6] via-[#1E88E5] to-[#0D47A1] text-white font-semibold px-3 py-2 rounded shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
