import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "./CartSlice.js";
import FavSlice from "./FavSlice.js";
import UserSlice from './UserSlice.js';


const Store = configureStore({
  reducer: {
    cart: CartSlice,
    fav: FavSlice,
  },
});


export default Store;