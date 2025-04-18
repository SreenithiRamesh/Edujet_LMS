import React, { useContext } from 'react';
import { AppContext } from '../../../Context/AppContext';

const Footer = () => {
    const { navigate } = useContext(AppContext);
  return (
    <footer className="bg-[#0D47A1] text-white pt-10 px-6 sm:px-10 md:px-20 w-full">
      {/* Grid Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 pb-10 border-b border-blue-300">
        {/* Column 1 */}
        <div>
          <h2 className="text-lg font-bold mb-4">About Us</h2>
          <img
        onClick={() => navigate("/")}
        src="https://ik.imagekit.io/ytissbwn8/EduJet_logo.png?updatedAt=1743949036710"
        alt="logo-img"
        className="w-28 lg:w-28 cursor-pointer bg-white rounded-sm mb-3"
      />

          <p className="text-sm text-gray-200">
            Your go-to platform for interactive learning and skill-building. Explore, grow, and thrive with us.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h2 className="text-lg font-bold mb-4">Quick Links</h2>
          <ul className="text-sm text-gray-200 space-y-2">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/course-List" className="hover:underline">Courses</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h2 className="text-lg font-bold mb-4">Connect</h2>
          <p className="text-sm text-gray-200 mb-4">
            Follow us on social media and stay updated.
          </p>
          <div className="flex gap-4 mb-6">
            <a href="#" className="hover:text-gray-300">Facebook</a>
            <a href="#" className="hover:text-gray-300">LinkedIn</a>
            <a href="#" className="hover:text-gray-300">Instagram</a>
          </div>

          {/* Email Subscription inside Column */}
          <h3 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h3>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 outline-1 text-white rounded text-sm"
            />
            <button
              type="submit"
              className="bg-white hover:bg-[#64B5F6] text-[#0D47A1] px-4 py-2 rounded text-sm font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-xs text-gray-300 pt-6 pb-4">
        &copy; {new Date().getFullYear()}. All rights reserved. Created by <span className='font-bold'>SreenithiRamesh.</span>
      </div>
    </footer>
  );
};

export default Footer;
