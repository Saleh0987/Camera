import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {toprateslaes} from '../data/data.js';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, setAddItemToCart, setOpenCart } from '../app/CartSlice';
import { setAddItemToFav, selectFavItems, setRemoveItemFromFav } from '../app/FavSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const favItems = useSelector(selectFavItems); 
  const isFavorited = favItems.some(item => item.id === id);
  const cartItems = useSelector(selectCartItems); 
  const isInCart = cartItems.some(item => item.id === id); 
  const dispatch = useDispatch();
  const onAddToCart = () => {
      const item = { 
      id: product.id, 
      color: product.color, 
      shadow: product.shadow, 
      title: product.title, 
      text: product.text, 
      img: product.img, 
      price: product.price 
    };
    dispatch(setAddItemToCart(item));
  }

    const onAddToFav = () => {
      const items = { 
      id: product.id, 
      color: product.color, 
      shadow: product.shadow, 
      title: product.title, 
      text: product.text, 
      img: product.img, 
      price: product.price 
    };
    dispatch(setAddItemToFav(items));
  }
  useEffect(() => {
    const foundProduct = toprateslaes.items.find((item) => item.id === id); 
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  if (!product) {
    return <div>Loading...</div>; 
  }

  return (
   <>
    <div className=" nike-container py-20">

      <div className={`relative bg-gradient-to-b ${product.color} ${product.shadow}
        flex flex-col items-center justify-evenly rounded-xl py-5 px-5 transition-all duration-700
        ease-in-out w-full min-h-[50vh] hover:scale-105`}>
        
          {/* img */}
          <div className={`flex items-center justify-center`}>
          <img src={product.img} alt={`img/item/${id}`}
          className={`transitions-theme hover:-rotate-12 sm:w-[200px] w-[300px] object-contain `}/>
        </div>
        {/* title & subtitle */}
        <div className={`grid items-center justify-items-center`}>
       <div className="flex flex-col items-center justify-center gap-4">
         <h1 className='text-slate-200 text-normal lg:text-lg md:text-base
          font-medium filter drop-shadow'>{product.title}</h1>
         <p className='text-slate-200 filter drop-shadow text-base md:text-sm font-normal border border-red-100 p-2'>{product.text}</p>
       <p className='text-slate-200 w-[50%] filter drop-shadow text-center md:text-sm font-normal'>{product.description}</p>
       </div>
            
          {/* price & rating */}
          <div className='flex items-center justify-between w-28 my-4'>
            <div className='flex items-center bg-white/80 px-1 rounded blur-effect-theme'>
              <h1  className='text-black text-sm font-medium'>${product.price}</h1>
            </div>

            <div className='flex items-center gap-1'>
              <StarIcon className='icon-style w-5 h-5 md:w-4 md:h-4' />
              <h1 className='md:text-sm font-normal text-slate-100'>{product.rating}</h1>
            </div>
          </div>

          {/* Button */}
          <div className='flex items-center gap-3'>
            <button type='button' className='blur-effect-theme button-theme p-0.5'
              onClick={() => { onAddToFav(); }}>
              <HeartIcon className={`icon-style ${isFavorited ? 'bg-red-800 text-white' : 'bg-white/90 text-black'}`} />
            </button>

            <button type='button' className={`blur-effect-theme button-theme px-2 py-1 shadow text-sm ${
                isInCart ? 'bg-red-600 text-white' : 'bg-white/90 text-black shadow-sky-200'
              }`}
        onClick={() => { onAddToCart(); }}>
                      {isInCart ? 'In Cart' : product.btn} 
             </button>
          </div>
        </div>


      </div>
    </div>
    </>
  );
};

export default ProductDetails;
