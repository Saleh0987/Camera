import React from 'react';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { setCloseCart, setDecreaseItemQTY, setIncreaseItemQTY, setRemoveItemFromCart } from '../app/CartSlice.js';
import { Link } from 'react-router-dom';


const CartItem = ({ item: { id, title, text, img, color, shadow, price, cartQuantity } }) => {
  
  const dispatch = useDispatch();

  const onRemoveItem = () => {
    dispatch(setRemoveItemFromCart({ id, title, text, img, color, shadow, price, cartQuantity }));
  }

  const onIncreaseItemQTY = () => {
    dispatch(setIncreaseItemQTY({ id, title, text, img, color, shadow, price, cartQuantity }));
  }

  const onDecreaseItemQTY = () => {
    dispatch(setDecreaseItemQTY({ id, title, text, img, color, shadow, price, cartQuantity }));
  }

  const onCartToggle = () => {
    dispatch(setCloseCart({
      cartState: false
    }));
  };


return (
  <>
    <div className='flex items-center justify-between w-full px-5 sm:px-3'>
      <div className='flex items-center gap-5 sm:gap-3'>

        <div className={`bg-gradient-to-b ${color} ${shadow} relative rounded p-3 sm:p-2 hover:scale-105 transition-all duration-75 
        ease-in-out grid items-center`}>
          <Link to={`/product/${id}`} onClick={onCartToggle} >
          <img src={img} alt={`img/cart-item/${id}`} className='w-36 h-auto object-fill lg:w-28 md:w-24 sm:w-20' />
          <div className='absolute right-1 top-1 blur-theme-effect bg-white/80 text-black text-xs px-1 rounded '>${price}</div>
          </Link>
        </div>

        <div className='grid items-center gap-4 sm:gap-2'>
          <div className='grid items-center leading-none'>
          <Link to={`/product/${id}`} onClick={onCartToggle}>
            <h1 className='font-medium text-lg text-slate-900 lg:text-sm sm:text-xs'>{title}</h1>
              <p className='text-sm text-slate-800 lg:text-xs sm:text-[10px]'>{text}</p>
          </Link>
          </div>

          <div className='flex items-center w-[250px] sm:w-[200px] gap-2'>

            <button type='button' onClick={onDecreaseItemQTY}
              className='bg-theme-cart rounded w-6 h-6 lg:w-5 sm:w-4 
              lg:h-5 sm:h-4 flex items-center justify-center active:scale-90'>
              <MinusIcon className='w-5 h-5 lg:w-4 sm:w-3.5 lg:h-4 sm:h-3.5 text-white stroke-[2]'/>
            </button>

            <div className={`bg-gradient-to-b ${color} ${shadow} rounded text-white font-medium lg:text-xs sm:text-[10px] 
              w-7 h-6 lg:h-5 lg:w-6 sm:w-5 sm:h-4 flex items-center justify-center`}>
              {cartQuantity}
            </div>

            <button type='button' onClick={onIncreaseItemQTY}
              className='bg-theme-cart rounded w-6 h-6 lg:w-5 sm:w-4 
              lg:h-5 sm:h-4 flex items-center justify-center active:scale-90'>
              <PlusIcon className='w-5 h-5 lg:w-4 sm:w-3.5 lg:h-4 sm:h-3.5 text-white stroke-[2]'/>
            </button>
          </div>

        </div>
      </div>

      <div className='grid items-center gap-5 sm:gap-3'>
        <div className='grid items-center justify-center'>
          <h1 className="text-lg lg:text-base sm:text-sm text-slate-900 font-medium">${price * cartQuantity}</h1>
        </div>

        <div className='grid items-center justify-center'>
          <button type='button' className='bg-theme-cart rounded p-1 lg:p-0.5 sm:p-0.5 grid items-center 
          justify-items-center cursor-pointer' onClick={onRemoveItem}>
            <TrashIcon className='w-5 h-5 lg:w-4 sm:w-3.5 text-white'/>
          </button>
        </div>
      </div>

    </div>
  </>
)

}

export default CartItem;