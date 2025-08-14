import React from 'react';
import  { useContext } from 'react';
import { AppContext } from '../../../Context/AppContext';

const EducatorFooter = () => {
  const { navigate } = useContext(AppContext);
  return (
    <footer className="bg-[#0D47A1] text-white w-full pt-10">
    
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-blue-300">

        <div>
          <img  onClick={() => navigate("/")}
            src="https://ik.imagekit.io/ytissbwn8/EduJet_logo.png?updatedAt=1743949036710"
            alt="logo-img"
            className="w-28 lg:w-28 cursor-pointer bg-white rounded-sm mb-3"
          />
          <p className="text-sm text-gray-200 mb-2">
            Empowering educators to build, manage, and share impactful courses.
          </p>
        </div>

        <div>
          <h2 className="text-md font-semibold mb-3">Quick Links</h2>
          <ul className="text-sm text-gray-200 space-y-1">
            <li><a href="/educator" className="hover:underline">Dashboard</a></li>
            <li><a href="/educator/add-course" className="hover:underline">Add Course</a></li>
            <li><a href="/educator/my-courses" className="hover:underline">My Courses</a></li>
            <li><a href="/educator/student-enrolled" className="hover:underline">Student Enrolled</a></li>
          </ul>
        </div>

      
        <div>
          <h2 className="text-md font-semibold mb-3">Support</h2>
          <p className="text-sm text-gray-200 mb-2">
            Need help or have feedback?
          </p>
          <a
            href="mailto:support@edujet.com"
            className="block bg-white text-[#0D47A1] px-4 py-2 rounded text-sm font-medium w-fit hover:bg-[#64B5F6] transition"
          >
            Contact Support
          </a>
        </div>
      </div>

      <div className="text-center text-xs text-gray-300 py-3 ">
        &copy; {new Date().getFullYear()}. All rights reserved. Created by <span className='font-bold'>SreenithiRamesh.</span>
      </div>
    </footer>
  );
};

export default EducatorFooter;
