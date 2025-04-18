import React from 'react';
import { assets, dummyEducatorData } from '../../../assets/assets';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();

  return (
    <div className='flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-4 border-b border-[#90caf9] bg-[#e3f2fd] text-[#0D47A1] shadow-sm'>
      
      {/* Logo */}
      <Link to='/'>
        <img 
          src="https://ik.imagekit.io/ytissbwn8/EduJet_logo.png?updatedAt=1743949036710"
          alt='EduJet Logo'
          className='w-28 lg:w-32'
        />
      </Link>

      {/* User Info */}
      <div className='flex items-center gap-4 sm:gap-6 text-sm sm:text-base font-medium'>
        <p>
          Hi! <span className='font-semibold'>{user ? user.fullName : 'Developer'}</span>
        </p>
        {
          user ? (
            <UserButton afterSignOutUrl='/' />
          ) : (
            <img 
              src={assets.profile_img}
              alt="Profile"
              className='w-8 h-8 rounded-full border border-[#0D47A1]'
            />
          )
        }
      </div>
    </div>
  );
};

export default Navbar;
