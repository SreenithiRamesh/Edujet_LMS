import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../Context/AppContext';
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
    <div className='min-h-screen bg-white w-full px-4 md:px-12 py-8'>
      <h2 className="text-3xl font-semibold text-[#0D47A1] mb-6">Students Enrolled</h2>

   
      <div className='overflow-x-auto bg-white rounded-xl shadow border border-[#BBDEFB] hidden sm:block'>
        <table className='min-w-full table-auto'>
          <thead className='text-[#1565C0] bg-[#E3F2FD] text-sm text-left'>
            <tr>
              <th className='px-4 py-4 font-semibold text-center'>#</th>
              <th className='px-4 py-4 font-semibold'>Student Name</th>
              <th className='px-4 py-4 font-semibold'>Course Title</th>
              <th className='px-4 py-4 font-semibold'>Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {enrolledStudents.map((item, index) => (
              <tr key={index} className='border-b border-[#BBDEFB] hover:bg-[#F1F8FF]'>
                <td className='px-4 py-4 text-center'>{index + 1}</td>
                <td className='px-4 py-4 flex items-center space-x-4'>
                  <img
                    src={item.student.imageUrl}
                    alt='student'
                    className='w-10 h-10 rounded-full border-2 border-[#1565C0]'
                  />
                  <span className='font-medium text-[#1565C0]'>{item.student.name}</span>
                </td>
                <td className='px-4 py-4 text-[#2196F3]'>{item.courseTitle}</td>
                <td className='px-4 py-4'>{new Date(item.purchaseDate).toLocaleDateString()}</td>
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

      <div className="sm:hidden flex flex-col gap-4 mt-4">
        {enrolledStudents.length === 0 ? (
          <p className="text-center text-gray-500">No students enrolled yet.</p>
        ) : (
          enrolledStudents.map((item, index) => (
            <div key={index} className="border border-[#BBDEFB] p-4 rounded-lg shadow">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={item.student.imageUrl}
                  alt="student"
                  className="w-10 h-10 rounded-full border-2 border-[#1565C0]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1565C0]">{item.student.name}</p>
                  <p className="text-xs text-gray-600">{new Date(item.purchaseDate).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-sm">
                <span className="font-semibold text-[#0D47A1]">Course:</span>{" "}
                <span className="text-[#2196F3]">{item.courseTitle}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  ) : <Loading />;
};

export default StudentsEnrolled;
