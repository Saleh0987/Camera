import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectTotalAmount, setGetTotals } from '../app/CartSlice';
import { Link } from 'react-router-dom';
import Address from '../utils/Address';

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);

    
  
  useEffect(() => {
    dispatch(setGetTotals());

  }, [cartItems, dispatch]);

  return (
    <>
      <div>
        <div className="nike-container rounded-md bg-gray-50 py-5">
          <div className="px-5">
            <div className="mb-2">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-600">Checkout.</h1>
              <h3 className="text-1xl  font-bold text-gray-800">Free shipping for any order above <span className='text-red-600'>
                $999
              </span></h3>
            </div>
          </div>
          <div className="w-full bg-white border-t border-b border-gray-200 px-5 py-10 text-gray-800">
            <div className="w-full">
              {cartItems.length === 0 ? (
                <div className="text-center min-h-[50vh] flex items-center justify-center flex-col">
                  <h2 className="text-xl font-semibold text-gray-600 mb-4">No Products in your Cart</h2>
                  <Link
                    to="/products"
                    className="inline-block bg-indigo-500 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg"
                  >
                    Go to Shopping
                  </Link>
                </div>
              ) : (
                <div className="-mx-3 md:flex flex-row sm:flex-col items-start">
                  <div className="px-3 sm:w-full md:w-7/12 sm:pr-3 lg:pr-10">
                    <div className="w-full mx-auto text-gray-800 font-light mb-6 border-b border-gray-200 pb-6">
                      <div className="flex sm:items-center justify-between flex-col w-full gap-2">
                        {cartItems.map((item, i) => (
                          <div
                            key={i}
                            className="sm:w-[100%] flex-row sm:flex-col sm:items-center sm:justify-center sm:gap-3 w-[50%] mx-auto border p-2 flex items-center"
                          >
                            <div className="overflow-hidden rounded-lg w-16 h-16 bg-gray-50 border border-gray-200">
                              <img src={item.img} alt={item.title} />
                            </div>
                            <div className="flex-grow sm:text-center pl-3">
                              <h6 className="font-semibold uppercase text-gray-600">{item.title}</h6>
                              <p className="text-gray-400">
                                (<span className="text-red-600">{item.cartQuantity}</span>)
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-600 text-xl">
                                ${item.price * item.cartQuantity}
                              </span>
                              <span className="font-semibold text-gray-600 text-sm">.00</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6 pb-6 border-b border-gray-200 text-gray-800">
                      <div className="w-full flex mb-3 items-center">
                        <div className="flex-grow">
                          <span className="text-gray-600">Subtotal</span>
                        </div>
                        <div className="pl-3">
                          <span className="font-semibold">${totalAmount}</span>
                        </div>
                      </div>
                      <div className="w-full flex mb-3 items-center">
                        <div className="flex-grow">
                          <span className="text-gray-600">Taxes (GST)</span>
                        </div>
                        <div className="pl-3">
                          <span className="font-semibold">$14.00</span>
                        </div>
                      </div>
                      <div className="w-full flex items-center">
                        <div className="flex-grow">
                          <span className="text-gray-600">Delivery Charge</span>
                        </div>
                        <div className="pl-3">
                            <span className="font-semibold">{totalAmount > 999 ? 'FREE': '$50'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-6 pb-6 border-b border-gray-200 md:border-none text-gray-800 text-xl">
                      <div className="w-full flex items-center">
                        <div className="flex-grow">
                          <span className="text-gray-600">Total</span>
                        </div>
                        <div className="pl-3">
                          <span className="font-semibold">${14 + 50 + totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Address />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
