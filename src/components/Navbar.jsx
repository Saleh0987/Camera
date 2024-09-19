import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import logo from '../../public/Logo-1.png';
import { setOpenCart, setClearCartItems, selectCartItems } from '../app/CartSlice.js';
import { setOpenFav, selectTotalQTYFav, setClearFavItems } from '../app/FavSlice.js';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegUser } from 'react-icons/fa';
import { LuLogOut } from "react-icons/lu";
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Navbar = () => {
  const [navState, setNavState] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItems = useSelector(selectCartItems);
  const totalFav = useSelector(selectTotalQTYFav);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = localStorage.getItem("loggedInUser");


  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          dispatch(setClearCartItems());
          dispatch(setClearFavItems());
          localStorage.removeItem('loggedInUser');
          navigate('/login'); 
          toast.success('Logged out successfully');
        }, 1500);
      }
    });
  };

  const onCartToggle = () => {
    dispatch(setOpenCart({ cartState: true }));
  };

  const onFavToggle = () => {
    dispatch(setOpenFav({ favState: true }));
  };

  const onNavScroll = () => {
    setNavState(window.scrollY > 30);
  };

  useEffect(() => {
    window.addEventListener('scroll', onNavScroll);
    return () => {
      window.removeEventListener('scroll', onNavScroll);
    };
  }, []);

  return (
    <>
      <header className={!navState ? 'absolute top-7 left-0 right-0 opacity-100 z-50' :
        'fixed top-0 left-0 right-0 h-[9vh] flex items-center opacity-100 z-[200] blur-effect-theme'}>
        <nav className='relative flex items-center justify-between nike-container'>
          <div className='flex items-center'>
            <Link to={user ? '' : '/login'}>
              <img src={logo} alt='logo/img' className={`w-40 h-auto ${navState && 'filter brightness-0'}`} />
            </Link>
          </div>


          {user ? <>
            <ul className={`absolute ${navState && 'text-slate-800'} top-[53px] left-0 flex w-full flex-col 
            items-center justify-center gap-3 transition-all mt-2
            duration-300 blur-effect-theme py-2 rounded-sm
            ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <li className='min-w-[120px] text-center px-4 py-2 rounded-md bg-black text-white'>
                <NavLink to=''
                  onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li className='min-w-[120px] text-center px-4 py-2 rounded-md bg-black text-white'>
              <NavLink to='/products' onClick={() => setMenuOpen(false)}>
                Products
              </NavLink>
            </li>
            <li className='min-w-[120px] text-center px-4 py-2 rounded-md bg-black text-white'>
              <NavLink to='/story' onClick={() => setMenuOpen(false)}>
                Blogs
              </NavLink>
            </li>
            <li className='min-w-[120px] text-center px-4 py-2 rounded-md bg-black text-white'>
              <NavLink to='/featured' onClick={() => setMenuOpen(false)}>
                Featured
              </NavLink>
            </li>
           </ul>

            <ul className={`text-white ${navState && 'text-slate-800'}  
          flex flex-row items-center justify-center gap-3 sm:hidden`}>
            <li>
              <NavLink to='' onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li >
              <NavLink to='/products' onClick={() => setMenuOpen(false)}>
                Products
              </NavLink>
            </li>
            <li >
              <NavLink to='/story' onClick={() => setMenuOpen(false)}>
                Blogs
              </NavLink>
            </li>
            <li >
              <NavLink to='/featured' onClick={() => setMenuOpen(false)}>
                Featured
              </NavLink>
            </li>
          </ul>
          </>
            : ''}

          <ul className='flex items-center justify-center gap-2'>
            {user ? 
              <li className='grid items-center'>
              <button  onClick={handleLogout}
              type="button" 
              className="border-none top-[3px] text-[17px] outline-none active:scale-110 transition-all 
              duration-300 relative text-white">
              <LuLogOut className={`icon-style ${navState && 'text-slate-900'}`} />
                </button>
            </li> : ''}

            <li className='grid items-center'>
              <Link to={user ? '/profile' : '/login'}>
              <button 
              type="button" 
              className="border-none top-[5px] text-[17px] outline-none active:scale-110 transition-all 
              duration-300 relative">
              <FaRegUser className={`icon-style ${navState && 'text-slate-900'}`} />
                </button>
              </Link>
            </li>
            {user ? <>
            
            <li className='grid items-center'>
              <button type='button' onClick={onFavToggle} className='relative'>
                <HeartIcon className={`icon-style ${navState && 'text-slate-900'}`} />
                <div className={`absolute top-4 right-0 w-4 h-4 rounded-full flex items-center justify-center 
                  ${navState ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
                  {totalFav}
                </div>
              </button>
            </li>

            <li className='grid items-center'>
              <button type='button' onClick={onCartToggle} className='relative'>
                <ShoppingBagIcon className={`icon-style ${navState && 'text-slate-900'}`} />
                <div className={`absolute top-4 right-0 w-4 h-4 rounded-full flex items-center justify-center 
                  ${navState ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
                  {cartItems.length}
                </div>
              </button>
            </li>

            <button
            className='sm:block hidden mt-2 text-white'
            onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <IoCloseSharp className={`icon-style text-[16px] ${navState && 'text-slate-900'}`} /> :
                  <GiHamburgerMenu className={`icon-style text-[16px] ${navState && 'text-slate-900'}`} />}
            </button>
            </> : ''}
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
