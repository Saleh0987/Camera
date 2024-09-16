import React from 'react';
import Highlight from './Highlight';
import { highlight } from '../data/data';
const Featured = ({ifExists, endpoint: {title, heading, text, img, btn}}) => {
  return (
    <>
      <div className={`flex items-center justify-between py-20 lg:flex-col lg:justify-center
        nike-container ${ifExists ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className='max-w-lg lg:max-w-none w-full md:text-center grid items-center 
        lg:justify-items-center'>

          <h1 className='text-4xl sm:text-3xl font-bold text-gradient'>{ heading }</h1>
          
          <h1 className='text-4xl lg:text-4xl md:-text3xl sm:text-2xl font-bold text-slate-900 
          filter drop-shadow-lg'>{title}</h1>

          <p className='xl:text-sm my-4 text-slate-900'>{text}</p>

          <a className='flex items-center' target={'_blank'} role='button'>
            <button type='button' className='button-theme bg-slate-900 
            text-slate-100 shadow-slate-900 py-1.5'>
              {btn}
            </button>
          </a>

        </div>
        <div className='flex items-center justify-center max-w-xl relative lg:max-w-none w-full'>
          <img src={img} alt={`img/heading`}
            className={`w-[300px] object-contain transitions-theme ${ifExists ?
              'rotate-6 hover:-rotate-12' :
              'rotate-[19deg] hover:rotate-12'}`} />
        </div>
      </div>
      <Highlight endpoint={highlight} ifExists/>
      
    </>
  )
}

export default Featured;