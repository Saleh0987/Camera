import React from 'react';
import { StarIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { setAddItemToCart, setOpenCart, selectCartItems } from '../app/CartSlice'; // Import selectCartItems
import { setAddItemToFav, selectFavItems, setRemoveItemFromFav } from '../app/FavSlice';
import { HeartIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Item = ({ ifExists, id, color, shadow, title, text, img, btn, rating, price }) => {
  
  const favItems = useSelector(selectFavItems); 
  const cartItems = useSelector(selectCartItems); // Get cart items from Redux store
  const isFavorited = favItems.some(item => item.id === id);
  const isInCart = cartItems.some(item => item.id === id); // Check if the item is in the cart

  const dispatch = useDispatch();
  
  // Function to add item to cart
  const onAddToCart = () => {
    const item = { id, color, shadow, title, text, img, price };
    dispatch(setAddItemToCart(item));
  }

  // Function to add item to favorites
  const onAddToFav = () => {
    const items = { id, color, shadow, title, text, img, price };
    dispatch(setAddItemToFav(items));
  }

  return (
    <>
      <div className={`relative bg-gradient-to-b ${color} ${shadow}
        grid items-center ${ifExists ? 'justify-items-start' : 'justify-items-center'} 
        rounded-xl py-5 px-5 transition-all duration-700
        ease-in-out w-full hover:scale-105`}>
        
        {/* title & subtitle */}
        <div className={`grid items-center ${ifExists ? 'justify-items-start' : 'justify-items-center'}`}>

          <h1 className='text-slate-200 text-normal lg:text-lg md:text-base
          font-medium filter drop-shadow'>{title}</h1>
          
          <p className='text-slate-200 filter drop-shadow text-base md:text-sm font-normal'>{text}</p>
          
          {/* price & rating */}
          <div className='flex items-center justify-between w-28 my-2'>
            <div className='flex items-center bg-white/80 px-1 rounded blur-effect-theme'>
              <h1 className='text-black text-sm font-medium'>${price}</h1>
            </div>

            <div className='flex items-center gap-1'>
              <StarIcon className='icon-style w-5 h-5 md:w-4 md:h-4' />
              <h1 className='md:text-sm font-normal text-slate-100'>{rating}</h1>
            </div>
          </div>

          {/* Buttons: Favorite and Add to Cart */}
          <div className='flex items-center gap-3'>
            <button
              type='button'
              className='blur-effect-theme button-theme p-0.5'
              onClick={() => { onAddToFav(); }}
            >
              <HeartIcon className={`icon-style ${isFavorited ? 'bg-red-800 text-white' : 'bg-white/90 text-black'}`} />
            </button>

            <button
              type='button'
              className={`blur-effect-theme button-theme px-2 py-1 shadow text-sm ${
                isInCart ? 'bg-red-600 text-white' : 'bg-white/90 text-black shadow-sky-200'
              }`}
              onClick={() => { onAddToCart(); }}
            >
              {isInCart ? 'In Cart' : btn} {/* Change button text if in cart */}
            </button>
          </div>
        </div>

        {/* Product Image */}
        <Link to={`/product/${id}`}>
          <div className={`flex items-center ${ifExists ? 'absolute top-5 right-1' : 'justify-center'}`}>
            <img src={img} alt={`img/item/${id}`}
              className={`transitions-theme hover:-rotate-12 ${ifExists ? 'h-auto w-32 lg:w-42 md:w-32' : 'w-40'}`} />
          </div>
        </Link>
      </div>
    </>
  );
}

export default Item;
