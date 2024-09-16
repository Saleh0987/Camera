import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ heroapi: { title, subtitle, btntext, img } }) => {

  const user = localStorage.getItem("loggedInUser");

  return (
    <div className='relative h-auto w-auto flex'>
      <div className='bg-gradient-to-r from-blue-800 to-gray-900 h-[100vh] w-auto absolute top-0 left-0 right-0 opacity-100 z-10'></div>

      <div className='relative opacity-100 z-20 flex justify-between items-center sm:flex-col sm:justify-center sm:items-center 
      md:flex-col md:justify-center lg:flex-col lg:items-center lg:justify-center h-[100vh] nike-container'>
        {/* Text Section */}
        <div className='flex flex-col items-center justify-center w-full gap-4 mt-12 sm:mb-9'>
          <h1 className='text-4xl lg:text-3xl md:text-3xl sm:text-2xl xsm:text-2xl 
          font-bold filter drop-shadow-sm text-center text-slate-200'>
            {title}
          </h1>
          <h2 className='text-4xl lg:text-3xl md:text-3xl sm:text-2xl xsm:text-2xl font-bold 
          filter drop-shadow-sm text-center text-slate-200 my-3'>
            {subtitle}
          </h2>
          <Link to={user ? 'products' : '/login'}>
            <button
            type='button'
            className='button-theme bg-slate-200 text-xl text-black shadow-slate-200 rounded-xl sm:text-lg md:text-xl lg:text-xl'
            aria-label={btntext}
          >
            {btntext}
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className='flex justify-center items-center w-full'>
          <img
            src={img}
            alt='Hero'
            className='w-auto h-[70vh] lg:h-[55vh] md:h-[45vh] sm:h-[35vh] object-contain'
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
