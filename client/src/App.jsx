import React, { useEffect } from 'react';
import './index.css';
import { Route, Routes, useMatch, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useUser } from "@clerk/clerk-react";

import Home from './Pages/Students/Home';
import CourseList from './Pages/Students/CourseList';
import CourseDetails from './Pages/Students/CourseDetails';
import MyEnrollments from './Pages/Students/MyEnrollments';
import CourseVideo from './Pages/Students/CourseVideo';
import Loading from './Components/Students/Loading/Loading';

import EducatorOnboarding from './Pages/Educators/EducatorOnboarding';
import Educator from './Pages/Educators/Educator';
import Dashboard from './Pages/Educators/Dashboard';
import StudentsEnrolled from './Pages/Educators/StudentsEnrolled';
import AddCourse from './Pages/Educators/AddCourse';
import MyCourses from './Pages/Educators/MyCourses';
import Navbar from './Components/Students/Navbar/Navbar';

import "quill/dist/quill.snow.css";

const App = () => {
  const isEducatorRoute = useMatch('/educator/*');
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    // If educator and not onboarded, redirect to onboarding page
    if (user?.publicMetadata?.role === "educator" && !user.publicMetadata?.onboarded) {
      navigate("/educator-onboarding");
    }
  }, [user, navigate]);

  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer />
      {!isEducatorRoute && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course-List' element={<CourseList />} />
        <Route path='/course-List/:input' element={<CourseList />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/my-enrollments' element={<MyEnrollments />} />
        <Route path='/course-video/:courseId' element={<CourseVideo />} />
        <Route path='/loading/:path' element={<Loading />} />
        <Route path='/educator-onboarding' element={<EducatorOnboarding />} />

        <Route path='/educator' element={<Educator />}>
          <Route path='/educator' element={<Dashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='student-enrolled' element={<StudentsEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
