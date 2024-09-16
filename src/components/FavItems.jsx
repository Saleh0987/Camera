import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
 selectFavItems,
 selectFavState,
 setClearFavItemsUser,
 setCloseFav,
 setGetTotals,
 selectTotalAmount,
 selectTotalQTYFav
} from '../app/FavSlice.js';
import FavCount from '../FavItem/FavCount.jsx';
import FavEmpty from '../FavItem/FavEmpty.jsx';
import FavItem from '../FavItem/FavItem.jsx';

const FavItems = () => {
  const dispatch = useDispatch();
  const ifFavState = useSelector(selectFavState);
  const FavItems = useSelector(selectFavItems);
  const totalAmount = useSelector(selectTotalAmount);
  const totalQTY = useSelector(selectTotalQTYFav);

  useEffect(() => {
    dispatch(setGetTotals());
  }, [FavItems, dispatch]);
 

  const onFavToggle = () => {
    dispatch(setCloseFav({
      favState: false
    }));
  };

  const onClearFavItems = () => {
    dispatch(setClearFavItemsUser());
  };

  return (
    <>
      <div className={`fixed top-0 bottom-0 right-0 blur-effect-theme w-full h-screen
        opacity-100 z-[250] ${ifFavState ? 'visible' : 'invisible'}`}>
        
        <div className={`fav-container ${ifFavState ? 'open' : 'closed'} blur-effect-theme 
        h-screen max-w-xl right-0 w-full absolute `}>
          <FavCount totalQTY={totalQTY} onFavToggle={onFavToggle} onClearFavItems={onClearFavItems} />
          {FavItems?.length === 0 ? (
            <FavEmpty onFavToggle={onFavToggle} />
          ) : (
            <div>
          <div className='flex items-start justify-start flex-col gap-y-7 lg:gap-y-5 overflow-y-scroll 
              h-[81vh] scroll-smooth scroll-hidden py-3'>
                {FavItems?.map((item, i) => (
                  <FavItem key={i} item={item} />
                ))}
              </div>
              
              <div className='fixed bottom-0 bg-white w-full px-5 py-2 grid items-center'>
                <div className='grid items-center gap-2'>
                    <button  onClick={onClearFavItems}
                      type='button' className='button-theme bg-theme-cart text-white'>
                      Clear Favorites
                    </button>
                </div>
              </div>
            </div>
          )}
      </div>
     

      </div>
    </>
  );
};

export default FavItems;
