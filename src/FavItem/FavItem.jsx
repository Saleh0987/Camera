import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { setCloseFav, setRemoveItemFromFav } from '../app/FavSlice.js';
import { setAddItemToCart, setRemoveItemFromCart, selectCartItems } from '../app/CartSlice.js';
import { Link } from 'react-router-dom';

const FavItem = ({ item: { id, title, text, img, color, shadow, price, favQuantity } }) => {
  
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const isInCart = cartItems.some(cartItem => cartItem.id === id);

  const onRemoveItem = () => {
    dispatch(setRemoveItemFromFav({ id, title, text, img, color, shadow, price, favQuantity }));
  };

  const onAddToCart = () => {
    const item = { id, color, shadow, title, text, img, price };
    dispatch(setAddItemToCart(item));
  };
    const onFavToggle = () => {
      dispatch(setCloseFav({
        favState: false
      }));
    };

  const onRemoveFromCart = () => {
    dispatch(setRemoveItemFromCart({ id, title }));
  };

return (
  <>
    <div className='flex flex-wrap items-center justify-between w-full px-5'>
      <div className='flex flex-wrap items-center gap-5'>

        <div className={`bg-gradient-to-b ${color} ${shadow} relative rounded p-3 hover:scale-105
        transition-all duration-75 ease-in-out grid items-center`}>
          <Link to={`/product/${id}`} onClick={onFavToggle}>
          <img src={img} alt={`img/cart-item/${id}`} className='w-36 h-auto object-fill lg:w-28 md:w-24 sm:w-20' />
            <div className='absolute right-1 top-1 blur-theme-effect bg-white/80 text-black text-xs px-1 rounded '>
              ${price}
            </div>
            </Link>
        </div>

        <div className='grid items-center gap-4'>
        <Link to={`/product/${id}`} onClick={onFavToggle}>
          <div className='grid items-center leading-none'>
            <h1 className='font-medium text-lg text-slate-900 lg:text-sm md:text-base sm:text-xs'>{title}</h1>
            <p className='text-sm text-slate-800 lg:text-xs md:text-sm sm:text-xs'>{text}</p>
          </div>
          </Link>          
          

          <div className="btn w-60 sm:w-full">
            {isInCart ? (
            <button type='button' className={`bg-red-500 w-full h-10 rounded blur-effect-theme button-theme 
              shadow shadow-sky-200 text-sm text-white`}
              onClick={onRemoveFromCart}>
              Remove from Cart
            </button>
          ) : (
            <button type='button' className={`bg-gradient-to-b ${color} ${shadow} w-full h-10 
            rounded blur-effect-theme button-theme shadow shadow-sky-200 text-sm text-white`}
              onClick={onAddToCart}>
              Add to Cart
            </button>
          )}
          </div>
        </div>
      </div>

      <div className='grid items-center gap-5'>
        <div className='grid items-center justify-center'>
          <button type='button' className='bg-theme-cart rounded p-1 lg:p-0.5 md:p-0.5 sm:p-0.5 
          grid items-center justify-items-center cursor-pointer'
            onClick={onRemoveItem}>
            <TrashIcon className='w-5 h-5 text-white'/>
          </button>
        </div>
      </div>

    </div>
  </>
);

};

export default FavItem;
