import React from 'react';
import { Footer, Navbar, Cart, Checkout } from './index.js';
import { footerAPI} from '../data/data.js'
import FavItems from './FavItems.jsx';
import { Outlet } from 'react-router';


const Layout = () => {
  return (
    <>
      <Navbar />
      <Cart />
      <FavItems />
      <div className="pt-20 min-h-[70vh] bg-gradient-to-r from-blue-800 to-gray-900 text-white ">
      <Outlet></Outlet>
      </div>
      <Footer footerAPI={footerAPI} />
    </>
  )
}

export default Layout;