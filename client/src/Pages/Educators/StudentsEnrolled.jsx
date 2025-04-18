import React, { useEffect, useState } from 'react';
import { dummyStudentEnrolled } from '../../assets/assets';
import Loading from "../../Components/Students/Loading/Loading"

const StudentsEnrolled = () => {

  const [EnrolledStudents, setEnrolledStudents] = useState(null)
  const fetchEnrolledStudents = async () => {
    setEnrolledStudents(dummyStudentEnrolled)
  }

  useEffect(() => {
    fetchEnrolledStudents()
  }, [])

  return EnrolledStudents ? (
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
              {EnrolledStudents.map((item, index) => (
                <tr key={index} className='border-b border-[#BBDEFB] hover:bg-[#F1F8FF]'>
                  <td className='px-4 py-4 text-center hidden sm:table-cell'>{index + 1}</td>
                  <td className='md:px-6 px-3 py-4 flex items-center space-x-4'>
                    <img src={item.student.imageUrl} alt='img' className='w-12 h-12 rounded-full border-2 border-[#1565C0]' />
                    <span className='truncate text-sm font-medium text-[#1565C0]'>{item.student.name}</span>
                  </td>
                  <td className='px-4 py-4 text-[#2196F3]'>{item.courseTitle}</td>
                  <td className='px-4 py-4 hidden sm:table-cell'>{new Date(item.purchaseDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default StudentsEnrolled;
