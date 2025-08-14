import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../../Context/AppContext'
import { assets } from "../../../assets/assets";

const SideBar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  return isEducator && (
    <div className='md:w-64 w-16 min-h-screen bg-[#e3f2fd] text-[#0D47A1] border-r border-[#90caf9] py-4 flex flex-col gap-1 shadow-md'>
  {menuItems.map((item) => (
  <NavLink
    to={item.path}
    key={item.name}
    end={item.path === '/educator'}  
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 mx-2 rounded-md transition font-medium 
       ${isActive ? 'bg-[#90caf9] text-white shadow-sm' : 'hover:bg-[#bbdefb] hover:text-[#0D47A1] text-[#0D47A1]'}`
    }
  >
    <img src={item.icon} alt={item.name} className="w-5 h-5" />
    <span className="hidden md:block">{item.name}</span>
  </NavLink>
))}

    </div>
  );
};

export default SideBar;
