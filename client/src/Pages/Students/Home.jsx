import React from 'react';
import HeroSection from '../../Components/Students/HeroSection/HeroSection';

import Companies from '../../Components/Students/Companies/Companies';
import CourseSection from '../../Components/Students/CourseSection/CourseSection';
import Testimonial from '../../Components/Students/Testimonials/Testimonials';
import CallToAction from '../../Components/Students/CallToAction/CallToAction';
import Footer from '../../Components/Students/Footer/Footer';


const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7'>
      <HeroSection/>
      <Companies/>
      <CourseSection/>
    
    <Testimonial/>
    <CallToAction/>
<Footer/>
    </div>
  );
}

export default Home;
