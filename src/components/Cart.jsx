import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems, selectCartState, setClearCartItemsUser, setCloseCart, setGetTotals, selectTotalAmount,
  selectTotalQTY
} from '../app/CartSlice.js';
import CartCount from '../cart/CartCount';
import CartEmpty from '../cart/CartEmpty';
import CartItem from '../cart/CartItem';
import { Link } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const ifCartState = useSelector(selectCartState);
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);

  useEffect(() => {
    dispatch(setGetTotals());
  }, [cartItems, dispatch]);

  const onCartToggle = () => {
    dispatch(setCloseCart({
      cartState: false
    }));
  };

  const onClearCartItems = () => {
    dispatch(setClearCartItemsUser());
  };

  return (
    <>
      
      <div className={`fixed top-0 left-0 right-0 bottom-0 blur-effect-theme w-full h-screen
        opacity-100 z-[250] ${ifCartState ? 'visible' : 'invisible'}`}>
        
        <div className={`cart-container ${ifCartState ? 'open' : 'closed'} blur-effect-theme h-screen max-w-xl w-full absolute right-0`}>
          <CartCount totalQTY={cartItems.length} onCartToggle={onCartToggle} onClearCartItems={onClearCartItems} />
          {cartItems?.length === 0 ? (
            <CartEmpty onCartToggle={onCartToggle} />
          ) : (
            <div>
              <div className='flex items-start justify-start flex-col gap-y-7 lg:gap-y-5 overflow-y-scroll h-[81vh] scroll-smooth scroll-hidden py-3'>
                {cartItems?.map((item, i) => (
                  <CartItem key={i} item={item} />
                ))}
              </div>
              
              <div className='fixed bottom-0 bg-white w-full px-5 py-2 grid items-center'>
                <div className='flex items-center justify-between'>
                  <h1 className='text-base font-semibold uppercase'>subTotal</h1>
                  <h1 className='text-sm rounded bg-theme-cart text-slate-100 px-1 py-0.5'>
                    ${totalAmount}</h1>
                </div>
                <div className='grid items-center gap-2'>
                  <p className='text-sm font-medium text-center'>
                    Taxes and Shipping Will Calculate At Shipping</p>
                  <Link 
                    to={'/checkout'} 
                    onClick={onCartToggle} 
                    className={`button-theme text-center text-white ${cartItems.length > 0 ? 'bg-red-500' : 'bg-theme-cart'}`}>
                    Check Out
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
