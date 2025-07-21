import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import Loading from "../../Components/Students/Loading/Loading";

const StudentsEnrolled = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(`${backendUrl}/api/educator/enrolled-students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.success) {
          setEnrolledStudents(data.enrolledStudents);
        } else {
          console.error("Failed to fetch students:", data.message);
        }
      } catch (err) {
        console.error("Failed to fetch enrolled students:", err);
      }
    };

    fetchEnrolledStudents();
  }, []);

  return enrolledStudents ? (
    <div className='min-h-screen bg-white w-full px-6 md:px-12 py-10'>
      <div>
        <h2 className="text-3xl font-semibold text-[#0D47A1] mb-8">Students Enrolled</h2>
        <div className='overflow-x-auto bg-white rounded-xl shadow border border-[#BBDEFB] mt-6 hidden sm:block'>
          <table className='min-w-full table-auto'>
            <thead className='text-[#1565C0] bg-[#E3F2FD] text-sm text-left'>
              <tr>
                <th className='px-4 py-4 font-semibold text-center hidden sm:table-cell'>#</th>
                <th className='px-4 py-4 font-semibold'>Student Name</th>
                <th className='px-4 py-4 font-semibold'>Course Title</th>
                <th className='px-4 py-4 font-semibold hidden sm:table-cell'>Date</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {enrolledStudents.map((item, index) => (
                <tr key={index} className='border-b border-[#BBDEFB] hover:bg-[#F1F8FF]'>
                  <td className='px-4 py-4 text-center hidden sm:table-cell'>{index + 1}</td>
                  <td className='md:px-6 px-3 py-4 flex items-center space-x-4'>
                    <img
                      src={item.student.imageUrl}
                      alt='student'
                      className='w-12 h-12 rounded-full border-2 border-[#1565C0]'
                    />
                    <span className='truncate text-sm font-medium text-[#1565C0]'>{item.student.name}</span>
                  </td>
                  <td className='px-4 py-4 text-[#2196F3]'>{item.courseTitle}</td>
                  <td className='px-4 py-4 hidden sm:table-cell'>{new Date(item.purchaseDate).toLocaleDateString()}</td>
                </tr>
              ))}
              {enrolledStudents.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">No students enrolled yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />;
};

export default StudentsEnrolled;
