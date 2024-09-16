import {createSlice} from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Helper function to get the logged-in user's email
const getLoggedInUserEmail = () => {
  const user = localStorage.getItem("loggedInUser");
  return user ? JSON.parse(user).email : null;
};

// Helper function to get the user's cart from localStorage
const getUserCart = () => {
  const email = getLoggedInUserEmail();
  return email ? JSON.parse(localStorage.getItem(`cart_${email}`)) || [] : [];
};

const initialState = {
  cartState: false,
  cartItems: getUserCart(),
  cartTotalAmount: 0,
  cartTotalQuantity: 0,
};

const CartSlice = createSlice({
  initialState,
  name: "cart",
  reducers: {
    setOpenCart: (state, action) => {
      state.cartState = action.payload.cartState;
    },
    setCloseCart: (state, action) => {
      state.cartState = action.payload.cartState;
    },
    updateLocalStorage: (state) => {
      const email = getLoggedInUserEmail();
      if (email) {
        localStorage.setItem(`cart_${email}`, JSON.stringify(state.cartItems));
      }
    },
    setAddItemToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0) {
        // If the item is already in the cart, remove it
        const item = state.cartItems[itemIndex];
        state.cartItems.splice(itemIndex, 1);
        toast.error(`${item.title} removed from Cart`);
      } else {
        // If the item is not in the cart, add it
        state.cartItems.push({...action.payload, cartQuantity: 1});
        toast.success(`${action.payload.title} added to Cart`);
      }

      CartSlice.caseReducers.updateLocalStorage(state);
    },
    setRemoveItemFromCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0) {
        const item = state.cartItems[itemIndex];
        state.cartItems.splice(itemIndex, 1);
        toast.error(`${item.title} removed from Cart`);
      }

      CartSlice.caseReducers.updateLocalStorage(state);
    },
    setIncreaseItemQTY: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity += 1;
        toast.success(`Item QTY Increased`);
      }

      CartSlice.caseReducers.updateLocalStorage(state);
    },
    setDecreaseItemQTY: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0 && state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;
        toast.error(`Item QTY Decreased`);
      }

      CartSlice.caseReducers.updateLocalStorage(state);
    },
    setGetTotals: (state) => {
      const {totalAmount, totalQuantity} = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const {price, cartQuantity} = cartItem;
          cartTotal.totalAmount += price * cartQuantity;
          cartTotal.totalQuantity += cartQuantity;
          return cartTotal;
        },
        {totalAmount: 0, totalQuantity: 0}
      );

      state.cartTotalAmount = totalAmount;
      state.cartTotalQuantity = totalQuantity;
    },
    setLoadUserCart: (state, action) => {
      const email = action.payload.email;
      const userCart = JSON.parse(localStorage.getItem(`cart_${email}`)) || [];
      state.cartItems = userCart;
    },
    setClearCartItems: (state) => {
      state.cartItems = [];
      state.cartTotalAmount = 0;
      state.cartTotalQuantity = 0;
    },
    setClearCartItemsUser: (state) => {
      state.cartItems = [];
     const email = getLoggedInUserEmail();
     if (email) {
       localStorage.removeItem(`cart_${email}`);
     }

    },
  },
});

export const {
  setOpenCart,
  setCloseCart,
  setAddItemToCart,
  setRemoveItemFromCart,
  setClearCartItemsUser,
  setIncreaseItemQTY,
  setDecreaseItemQTY,
  setClearCartItems,
  setGetTotals,
  setLoadUserCart,
} = CartSlice.actions;

export const selectCartState = (state) => state.cart.cartState;
export const selectCartItems = (state) => state.cart.cartItems;
export const selectTotalAmount = (state) => state.cart.cartTotalAmount;
export const selectTotalQTY = (state) => state.cart.cartTotalQuantity;

export default CartSlice.reducer;
