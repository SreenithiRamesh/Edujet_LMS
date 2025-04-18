import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({data}) => {
  const navigate=useNavigate()
  const [input,setInput]=useState(data ? data :"")

  const onSearchHandler =(e)=>{
    e.preventDefault()
    navigate('/course-list/' +input)
  }
  return (
    
<form onSubmit={onSearchHandler} className='max-w-xs md:max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded-full shadow-2xs'>
<FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#0d47a1] md:w-auto w-10 px-3" />
<input onChange={e=>setInput(e.target.value)} value={input}
 type='text' placeholder='Search for courses' className='w-full h-full outline-none text-[#42a5f5]'/>
<button type='submit' className="bg-gradient-to-r from-[#64B5F6] via-[#1E88E5] to-[#0D47A1] text-white font-semibold md:px-8 px-6 md:py-2 py-1 mx-1 rounded-full shadow-lg hover:shadow-xl transition duration-300 cursor-pointer">
  Search
</button>
{/* <button className="bg-gradient-to-r from-[#BBDEFB] to-[#64B5F6] text-[#0D47A1] font-medium px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition duration-200">
  Explore Courses
</button> */}



</form>
   
  );
}

export default SearchBar;
