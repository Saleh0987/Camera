import {createSlice} from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const getLoggedInUserEmail = () => {
  const user = localStorage.getItem("loggedInUser");
  return user ? JSON.parse(user).email : null;
};

const getUserFav = () => {
  const email = getLoggedInUserEmail();
  return email ? JSON.parse(localStorage.getItem(`fav_${email}`)) || [] : [];
};

const initialState = {
  favState: false,
  favItems: getUserFav(),
  favTotalAmount: 0,
  favTotalQuantity: 0,
};

const FavSlice = createSlice({
  initialState,
  name: "fav",

  reducers: {
    setOpenFav: (state, action) => {
      state.favState = action.payload.favState;
    },
    setCloseFav: (state, action) => {
      state.favState = action.payload.favState;
    },

    setAddItemToFav: (state, action) => {
      const itemNum = state.favItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemNum >= 0) {
        // If the item is already in favorites, remove it
        const removedItem = state.favItems[itemNum];
        state.favItems.splice(itemNum, 1);
        toast.error(`${removedItem.title} removed from Favorites`);
      } else {
        // If the item is not in favorites, add it
        const newItem = {...action.payload, favQuantity: 1};
        state.favItems.push(newItem);
        toast.success(`${action.payload.title} added to Favorites`);
      }

      const email = getLoggedInUserEmail();
      if (email) {
        localStorage.setItem(`fav_${email}`, JSON.stringify(state.favItems));
      }

      FavSlice.caseReducers.setGetTotals(state);
    },

    setRemoveItemFromFav: (state, action) => {
      const itemToRemove = state.favItems.find(
        (item) => item.id === action.payload.id
      );

      if (itemToRemove) {
        state.favItems = state.favItems.filter(
          (item) => item.id !== action.payload.id
        );

        const email = getLoggedInUserEmail();
        if (email) {
          localStorage.setItem(`fav_${email}`, JSON.stringify(state.favItems));
        }

        toast.error(`${itemToRemove.title} removed from Favorites`);
      }
    },

    setGetTotals: (state) => {
      const {totalAmount, totalQTY} = state.favItems.reduce(
        (favTotal, favItem) => {
          const {price, favQuantity} = favItem;
          const totalPrice = price * favQuantity;

          favTotal.totalAmount += totalPrice;
          favTotal.totalQTY += favQuantity;

          return favTotal;
        },
        {
          totalAmount: 0,
          totalQTY: 0,
        }
      );

      state.favTotalAmount = totalAmount;
      state.favTotalQuantity = totalQTY;
    },

    setClearFavItems: (state) => {
      state.favItems = [];
      state.favTotalAmount = 0;
      state.favTotalQuantity = 0;
    },
    setClearFavItemsUser: (state) => {
      state.favItems = [];
      const email = getLoggedInUserEmail();
      if (email) {
        localStorage.removeItem(`fav_${email}`);
      }
    },

    setLoadUserFav: (state, action) => {
      const email = action.payload.email;
      const userFav = localStorage.getItem(`fav_${email}`);
      state.favItems = userFav ? JSON.parse(userFav) : [];
    },
  },
});

export const {
  setOpenFav,
  setCloseFav,
  setAddItemToFav,
  setRemoveItemFromFav,
  setClearFavItems,
  setClearFavItemsUser,
  setGetTotals,
  setLoadUserFav,
} = FavSlice.actions;

export const selectFavState = (state) => state.fav.favState;
export const selectFavItems = (state) => state.fav.favItems;
export const selectTotalAmount = (state) => state.fav.favTotalAmount;
export const selectTotalQTYFav = (state) => state.fav.favTotalQuantity;

export default FavSlice.reducer;
