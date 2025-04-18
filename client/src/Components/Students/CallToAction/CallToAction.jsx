import React from 'react';
import { assets } from '../../../assets/assets';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <div className="w-full mb-0 bg-gradient-to-b from-white via-[#E3F2FD] to-[#BBDEFB] py-16 px-4 sm:px-10 md:px-20 text-center">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#0D47A1] mb-4 drop-shadow">
        Click, Learn, Win!
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
        Take the first step toward a smarter, stronger, and more successful you.
      </p>

      <div className="flex flex-wrap justify-center items-center gap-4">
      <Link to={'/course-list'} onClick={() => scrollTo(0, 0)}>
        <button className="text-xs sm:text-sm md:text-base bg-gradient-to-r from-[#64B5F6] via-[#1E88E5] to-[#0D47A1] text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition duration-300">
          Get Started
        </button></Link>
        <Link to={'/course-list'} onClick={() => scrollTo(0, 0)}>
        <button className="flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base bg-white text-[#0D47A1] font-semibold px-5 py-3 rounded-lg shadow-md border border-[#0D47A1] hover:bg-[#e3f2fd] transition duration-300">
          Learn More <img className='' src={assets.arrow_icon} alt='arrow'/>
        </button></Link>
      </div>
    </div>
  );
};

export default CallToAction;

