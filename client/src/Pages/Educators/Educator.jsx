import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../Components/Educators/Navbar/Navbar';
import SideBar from '../../Components/Educators/SideBar/SideBar';
import EducatorFooter from '../../Components/Educators/EducatorFooter/EducatorFooter';

const   Educator = () => {
  return (
    <div className='text-[15px] min-h-screen bg-white'>
     <Navbar/>
  
      <div className='flex'>
      <SideBar/>
      <div className='flex-1'>
      {<Outlet/>}
      </div>
        
      </div>
      <EducatorFooter/>
    </div>
  );
}

export default Educator;
